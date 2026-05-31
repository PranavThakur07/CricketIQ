import random
from typing import List, Dict, Any
from app.models.schemas import PredictionRequest, MomentumResponse, OverMomentum

# Preloaded realistic match profiles for quick GET presets retrieval
SAMPLE_MATCHES = {
    "ind_vs_pak_2022": {
        "batting_team": "India",
        "bowling_team": "Pakistan",
        "match_name": "India vs Pakistan (T20 World Cup 2022)",
        "overs": [
            {"over": 1, "runs": 5, "wickets": 0},
            {"over": 2, "runs": 4, "wickets": 1},  # Rahul out
            {"over": 3, "runs": 3, "wickets": 0},
            {"over": 4, "runs": 6, "wickets": 1},  # Rohit out
            {"over": 5, "runs": 4, "wickets": 0},
            {"over": 6, "runs": 9, "wickets": 1},  # Suryakumar out (Powerplay over)
            {"over": 7, "runs": 3, "wickets": 0},
            {"over": 8, "runs": 5, "wickets": 0},
            {"over": 9, "runs": 4, "wickets": 1},  # Axar run out
            {"over": 10, "runs": 9, "wickets": 0},
            {"over": 11, "runs": 6, "wickets": 0},
            {"over": 12, "runs": 20, "wickets": 0}, # Kohli & Pandya assault on Shadab (20 runs!)
            {"over": 13, "runs": 9, "wickets": 0},
            {"over": 14, "runs": 6, "wickets": 0},
            {"over": 15, "runs": 9, "wickets": 0},
            {"over": 16, "runs": 6, "wickets": 0},
            {"over": 17, "runs": 6, "wickets": 0},
            {"over": 18, "runs": 17, "wickets": 0}, # Shaheen Afridi over
            {"over": 19, "runs": 15, "wickets": 0}, # Haris Rauf (Kohli's legendary 2 sixes back-to-back!)
            {"over": 20, "runs": 16, "wickets": 2}  # Final over extreme drama (Nawaz over)
        ]
    },
    "rcb_vs_srh_2016": {
        "batting_team": "RCB",
        "bowling_team": "SRH",
        "match_name": "RCB vs SRH (IPL 2016 Final)",
        "overs": [
            {"over": 1, "runs": 5, "wickets": 0},
            {"over": 2, "runs": 9, "wickets": 0},
            {"over": 3, "runs": 12, "wickets": 0},
            {"over": 4, "runs": 15, "wickets": 0},
            {"over": 5, "runs": 18, "wickets": 0},
            {"over": 6, "runs": 16, "wickets": 0}, # Powerplay explosion (75/0)
            {"over": 7, "runs": 8, "wickets": 0},
            {"over": 8, "runs": 14, "wickets": 0},
            {"over": 9, "runs": 11, "wickets": 0},
            {"over": 10, "runs": 13, "wickets": 0},
            {"over": 11, "runs": 4, "wickets": 1},  # Chris Gayle out (114/1)
            {"over": 12, "runs": 15, "wickets": 0},
            {"over": 13, "runs": 11, "wickets": 1}, # Kohli bowled by Sran (140/2)
            {"over": 14, "runs": 8, "wickets": 0},
            {"over": 15, "runs": 6, "wickets": 1},  # De Villiers out (148/3)
            {"over": 16, "runs": 5, "wickets": 0},
            {"over": 17, "runs": 10, "wickets": 1}, # Lokesh Rahul out
            {"over": 18, "runs": 9, "wickets": 1},  # Watson out
            {"over": 19, "runs": 7, "wickets": 1},  # Binny run out
            {"over": 20, "runs": 6, "wickets": 1}   # SRH blocks boundaries to win
        ]
    },
    "ind_vs_aus_2023": {
        "batting_team": "India",
        "bowling_team": "Australia",
        "match_name": "India vs Australia (World Cup 2023 Final)",
        "overs": [
            {"over": 1, "runs": 13, "wickets": 0}, # Rohit starts fast
            {"over": 2, "runs": 3, "wickets": 0},
            {"over": 3, "runs": 14, "wickets": 0},
            {"over": 4, "runs": 7, "wickets": 1},  # Gill out
            {"over": 5, "runs": 11, "wickets": 0},
            {"over": 6, "runs": 6, "wickets": 0},
            {"over": 7, "runs": 14, "wickets": 0},
            {"over": 8, "runs": 8, "wickets": 0},
            {"over": 9, "runs": 4, "wickets": 1},  # Rohit Sharma out (stunning catch)
            {"over": 10, "runs": 1, "wickets": 1}, # Shreyas Iyer out
            {"over": 11, "runs": 3, "wickets": 0}, # Spin choke begins
            {"over": 12, "runs": 2, "wickets": 0},
            {"over": 13, "runs": 3, "wickets": 0},
            {"over": 14, "runs": 4, "wickets": 0},
            {"over": 15, "runs": 4, "wickets": 0},
            {"over": 16, "runs": 3, "wickets": 0},
            {"over": 17, "runs": 2, "wickets": 0},
            {"over": 18, "runs": 4, "wickets": 0},
            {"over": 19, "runs": 3, "wickets": 0},
            {"over": 20, "runs": 5, "wickets": 0}  # India chokes in middle overs
        ]
    }
}

def calculate_live_probabilities(req: PredictionRequest) -> dict:
    """
    Perform cricket-specific win probability calculations.
    Uses standard cricketing variables: run rate, required run rate, wickets in hand, balls remaining.
    """
    total_overs = 20.0 if req.format == "T20" else 50.0
    if req.format == "Test":
        total_overs = 90.0

    overs_left = total_overs - req.overs_completed
    overs_left = max(overs_left, 0.05)
    balls_left = int(overs_left * 6)
    
    runs_needed = req.target - req.current_score
    wickets_left = 10 - req.wickets_lost

    current_run_rate = req.current_score / max(req.overs_completed, 0.1)
    required_run_rate = runs_needed / overs_left

    if runs_needed <= 0:
        return {
            "batting_win_probability": 100.0,
            "bowling_win_probability": 0.0,
            "required_run_rate": 0.0,
            "current_run_rate": current_run_rate
        }
    if wickets_left <= 0 or (balls_left <= 0 and runs_needed > 0):
        return {
            "batting_win_probability": 0.0,
            "bowling_win_probability": 100.0,
            "required_run_rate": required_run_rate,
            "current_run_rate": current_run_rate
        }

    wicket_ratio = wickets_left / 10.0
    rate_diff = required_run_rate - current_run_rate
    
    exponent = -0.3 * (rate_diff) + (wicket_ratio - 0.5) * 4.0
    exponent = max(min(exponent, 10.0), -10.0)
    
    import math
    batting_prob = 1.0 / (1.0 + math.exp(-exponent))
    batting_percentage = batting_prob * 100.0
    
    if balls_left < 12:
        if runs_needed > balls_left * 4:
            batting_percentage = min(batting_percentage, 5.0)
        elif runs_needed > balls_left * 6:
            batting_percentage = 0.0

    batting_percentage = max(min(batting_percentage, 99.9), 0.1)
    bowling_percentage = 100.0 - batting_percentage

    return {
        "batting_win_probability": round(batting_percentage, 2),
        "bowling_win_probability": round(bowling_percentage, 2),
        "required_run_rate": round(required_run_rate, 2),
        "current_run_rate": round(current_run_rate, 2)
    }

def generate_momentum_swings(batting_team: str, bowling_team: str) -> MomentumResponse:
    """
    Generate beautiful mock over-by-over momentum indicators for visualization.
    Shows spikes for boundaries and drops for wickets.
    """
    overs_data = []
    random.seed(42)
    
    highlights_choices = [
        "Massive six over mid-wicket!",
        "Beautiful cover drive for four.",
        "Unbelievable direct hit run out!",
        "Three dot balls in a row - bowling pressure mounts.",
        "Tidy over: just 3 runs conceded.",
        "Clean bowled! Stump knocked flying."
    ]

    for over in range(1, 21):
        runs = random.randint(2, 18)
        wickets = 1 if (random.random() < 0.15 and over not in [1, 2]) else 0
        
        if wickets > 0:
            batting_mom = -6.0 - random.randint(0, 3)
            bowling_mom = 7.0 + random.randint(0, 2)
            highlight = "Clean bowled! Stump knocked flying."
        elif runs > 10:
            batting_mom = 5.0 + (runs - 10) * 0.5
            bowling_mom = -5.0 - (runs - 10) * 0.3
            highlight = "Massive six over mid-wicket!"
        else:
            batting_mom = random.uniform(-2.0, 3.0)
            bowling_mom = -batting_mom
            highlight = "Tidy over: just 3 runs conceded."

        overs_data.append(
            OverMomentum(
                over_number=over,
                batting_team_momentum=round(batting_mom, 2),
                bowling_team_momentum=round(bowling_mom, 2),
                runs_scored=runs,
                wickets_lost=wickets,
                highlights=highlight
            )
        )

    net_batting_mom = sum(o.batting_team_momentum for o in overs_data)
    owner = batting_team if net_batting_mom >= 0 else bowling_team
    summary = f"The match witnessed dramatic swings. resurgent partnership has swung momentum to {owner}."

    return MomentumResponse(
        match_id="MOCK-MATCH-001",
        batting_team=batting_team,
        bowling_team=bowling_team,
        overs_data=overs_data,
        current_momentum_owner=owner,
        momentum_summary=summary
    )

def generate_momentum_narrative(batting_team: str, bowling_team: str, overs_calculated: List[Dict[str, Any]], turning_over: int) -> str:
    """
    Generate a highly contextual, deterministic AI narrative summarizing momentum stages and swings.
    """
    # 1. Detect highest scoring 3-over window
    max_runs_phase = 0
    phase_start = 1
    phase_end = 3
    for i in range(len(overs_calculated) - 2):
        runs_sum = sum(o["runs"] for o in overs_calculated[i:i+3])
        if runs_sum > max_runs_phase:
            max_runs_phase = runs_sum
            phase_start = overs_calculated[i]["over"]
            phase_end = overs_calculated[i+2]["over"]
            
    # 2. Detect wickets
    wicket_overs = [o["over"] for o in overs_calculated if o["wickets"] > 0]
    
    # 3. Retrieve turning point data
    turning_over_data = next((o for o in overs_calculated if o["over"] == turning_over), None)
    turning_over_runs = turning_over_data["runs"] if turning_over_data else 0
    turning_over_wkts = turning_over_data["wickets"] if turning_over_data else 0
    turning_swing = abs(turning_over_data["momentum_swing"]) if turning_over_data else 0.0
    
    narrative = (
        f"*{batting_team}* gained significant momentum between overs **{phase_start} and {phase_end}**, "
        f"scoring a massive total of **{max_runs_phase} runs**. "
    )
    if wicket_overs:
        narrative += f"However, *{bowling_team}* successfully choked the run flow with key wickets crashing in over(s) **{', '.join(map(str, wicket_overs[:3]))}**. "
        
    narrative += (
        f"The ultimate turning point of the match occurred in **Over {turning_over}**, "
        f"where a massive momentum swing of **{turning_swing:.1f} points** occurred. "
    )
    
    if turning_over_wkts > 0:
        narrative += f"This swing was triggered by a crucial wicket loss that broke the batting team's back and turned the match decisively in *{bowling_team}*'s favor."
    elif turning_over_runs >= 12:
        narrative += f"This swing was generated by a blistering **{turning_over_runs}-run onslaught**, shifting absolute control back to *{batting_team}*."
    else:
        narrative += f"This shifted the pressure and realigned the match dynamic in favor of the defending side."
        
    return narrative

def calculate_momentum_data(batting_team: str, bowling_team: str, raw_overs: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Core Momentum Engine: computes Current Run Rate, Average Run Rate, 
    Momentum Scores, Momentum Swings, Turning Point Detection, and Narrative.
    """
    cumulative_runs = 0
    cumulative_wickets = 0
    overs_calculated = []
    
    prev_momentum = 0.0
    for idx, o in enumerate(raw_overs):
        over_num = o.get("over") or (idx + 1)
        runs = o.get("runs", 0)
        wickets = o.get("wickets", 0)
        
        cumulative_runs += runs
        cumulative_wickets += wickets
        
        current_rr = cumulative_runs / over_num if over_num > 0 else 0.0
        
        # Momentum score calculation: (runs * 1.5) - (wickets * 12.0) - baseline expected rate of 7.5
        mom_score = (runs * 1.5) - (wickets * 12.0) - 7.5
        # Bound it between -15.0 and 15.0
        mom_score = max(-15.0, min(15.0, mom_score))
        
        # Momentum swing is the difference from previous over
        mom_swing = mom_score - prev_momentum if over_num > 1 else mom_score
        
        # Format a dynamic short over comment
        if wickets > 0:
            highlight = f"WICKET! Big breakthrough in Over {over_num}."
        elif runs >= 12:
            highlight = f"BOUNDARIES! Over {over_num} leaked {runs} runs."
        elif runs <= 3:
            highlight = f"PRESSURE! Tight bowling, only {runs} runs."
        else:
            highlight = f"Steady play, {runs} runs added."
            
        overs_calculated.append({
            "over": over_num,
            "runs": runs,
            "wickets": wickets,
            "current_run_rate": round(current_rr, 2),
            "average_run_rate": 0.0, # Populated after loop
            "momentum_score": round(mom_score, 2),
            "momentum_swing": round(mom_swing, 2),
            "is_turning_point": False, # Populated after loop
            "highlight": highlight
        })
        
        prev_momentum = mom_score
        
    total_runs = cumulative_runs
    total_overs = len(raw_overs)
    avg_rr = total_runs / total_overs if total_overs > 0 else 0.0
    
    # Populate average run rates
    for o in overs_calculated:
        o["average_run_rate"] = round(avg_rr, 2)
        
    # Turning point detection: over with the largest absolute momentum swing (excluding over 1)
    turning_point_over = 1
    max_swing_abs = -1.0
    for o in overs_calculated:
        if o["over"] > 1:
            abs_swing = abs(o["momentum_swing"])
            if abs_swing > max_swing_abs:
                max_swing_abs = abs_swing
                turning_point_over = o["over"]
                
    # Mark the detected turning point over
    for o in overs_calculated:
        if o["over"] == turning_point_over:
            o["is_turning_point"] = True
            
    # Best over = highest runs scored
    best_over = max(raw_overs, key=lambda x: x.get("runs", 0)).get("over", 1) if raw_overs else 1
    
    # Worst over = lowest momentum score
    worst_over = min(overs_calculated, key=lambda x: x["momentum_score"])["over"] if overs_calculated else 1
    
    # Current Momentum Holder = look at average of last 3 overs momentum
    last_overs = overs_calculated[-3:] if len(overs_calculated) >= 3 else overs_calculated
    avg_last_mom = sum(o["momentum_score"] for o in last_overs) / len(last_overs) if last_overs else 0.0
    mom_holder = batting_team if avg_last_mom >= 0 else bowling_team
    
    # Generate narrative
    ai_narrative = generate_momentum_narrative(batting_team, bowling_team, overs_calculated, turning_point_over)
    
    return {
        "batting_team": batting_team,
        "bowling_team": bowling_team,
        "overs_calculated": overs_calculated,
        "best_over": best_over,
        "worst_over": worst_over,
        "match_turning_point": turning_point_over,
        "current_momentum_holder": mom_holder,
        "ai_narrative": ai_narrative
    }
