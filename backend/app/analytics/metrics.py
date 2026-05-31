import random
from app.models.schemas import PredictionRequest, PredictionResponse, MomentumResponse, OverMomentum
from app.services.gemini import gemini_service

def calculate_live_probabilities(req: PredictionRequest) -> dict:
    """
    Perform cricket-specific win probability calculations.
    Uses standard cricketing variables: run rate, required run rate, wickets in hand, balls remaining.
    """
    # Define max overs based on format
    total_overs = 20.0 if req.format == "T20" else 50.0
    if req.format == "Test":
        total_overs = 90.0

    overs_left = total_overs - req.overs_completed
    overs_left = max(overs_left, 0.05) # Prevent divide by zero
    balls_left = int(overs_left * 6)
    
    runs_needed = req.target - req.current_score
    wickets_left = 10 - req.wickets_lost

    # Standard rates
    current_run_rate = req.current_score / max(req.overs_completed, 0.1)
    required_run_rate = runs_needed / overs_left

    # Logical edge cases
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

    # Probability math formula:
    # 1. Base probability: 50%
    # 2. Wicket penalty: losing wickets decreases probability
    # 3. Required rate pressure: higher RRR relative to CRR reduces probability
    # 4. Decay factor: as balls left decreases, standard deviation of potential outcomes shrinks
    
    wicket_ratio = wickets_left / 10.0 # 0.0 to 1.0
    
    # Calculate difference index
    rate_diff = required_run_rate - current_run_rate
    
    # Sigmoid function for probability
    # If required rate == current rate, probability is roughly 50% * wicket weight
    # If required rate is extremely high (e.g. 24), probability -> 0%
    # If required rate is low (e.g. 2), probability -> 100%
    
    exponent = -0.3 * (rate_diff) + (wicket_ratio - 0.5) * 4.0
    # Bound the exponent to avoid overflow
    exponent = max(min(exponent, 10.0), -10.0)
    
    import math
    batting_prob = 1.0 / (1.0 + math.exp(-exponent))
    
    # Normalize to percentage
    batting_percentage = batting_prob * 100.0
    
    # Dynamic adjusting factors based on balls remaining
    # If very few balls remain and runs are high, make it more realistic
    if balls_left < 12:
        if runs_needed > balls_left * 4: # Hard to hit boundaries every ball
            batting_percentage = min(batting_percentage, 5.0)
        elif runs_needed > balls_left * 6: # Mathematically impossible
            batting_percentage = 0.0

    # Ensure boundaries
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
    current_batting_momentum = 3.0
    
    random.seed(42) # Seed to keep results consistent for demos
    
    # Generate 20 overs of momentum shifts
    highlights_choices = [
        "Massive six over mid-wicket!",
        "Stumping missed by the keeper.",
        "Beautiful cover drive for four.",
        "Unbelievable direct hit run out!",
        "Three dot balls in a row - bowling pressure mounts.",
        "Bowling change: Premium spinner brought into attack.",
        "Consecutive boundaries! Batting side is flying.",
        "Tidy over: just 3 runs conceded.",
        "Clean bowled! Stump knocked flying.",
        "Leading edge caught at covers."
    ]

    for over in range(1, 21):
        runs = random.randint(2, 18)
        wickets = 1 if (random.random() < 0.15 and over not in [1, 2]) else 0
        
        # Calculate momentum index based on runs and wickets
        # Good over (runs > 8) increase batting momentum
        # Wicket crashes batting momentum and raises bowling momentum
        if wickets > 0:
            batting_mom = -6.0 - random.randint(0, 3)
            bowling_mom = 7.0 + random.randint(0, 2)
            highlight = random.choice([h for h in highlights_choices if "bowled" in h.lower() or "caught" in h.lower() or "run out" in h.lower()])
        elif runs > 10:
            batting_mom = 5.0 + (runs - 10) * 0.5
            bowling_mom = -5.0 - (runs - 10) * 0.3
            highlight = random.choice([h for h in highlights_choices if "six" in h.lower() or "four" in h.lower() or "boundaries" in h.lower()])
        else:
            # Steady overs
            batting_mom = random.uniform(-2.0, 3.0)
            bowling_mom = -batting_mom
            highlight = random.choice([h for h in highlights_choices if "dot" in h.lower() or "tidy" in h.lower() or "change" in h.lower()])

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

    # Summarize momentum
    net_batting_mom = sum(o.batting_team_momentum for o in overs_data)
    owner = batting_team if net_batting_mom >= 0 else bowling_team
    
    summary = (
        f"The match witnessed dramatic swings. {batting_team} dominated the Powerplay (overs 1-6), "
        f"but {bowling_team}'s double wicket strike in the 10th and 11th overs triggered a major crash in batting momentum. "
        f"A resurgent partnership starting in the 16th over has swung the momentum back to {owner} for the final phase."
    )

    return MomentumResponse(
        match_id="MOCK-MATCH-001",
        batting_team=batting_team,
        bowling_team=bowling_team,
        overs_data=overs_data,
        current_momentum_owner=owner,
        momentum_summary=summary
    )
