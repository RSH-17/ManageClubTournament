"""Save the local League of Legends Live Client Data API response as JSON."""

import argparse
import json
import ssl
import sys
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import urlopen


API_URL = "https://127.0.0.1:2999/liveclientdata/allgamedata"


def fetch_game_data():
    # Riot's local game client uses a self-signed certificate.
    context = ssl._create_unverified_context()
    with urlopen(API_URL, timeout=5, context=context) as response:
        return json.load(response)


def save_game_data(data, output):
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)
        file.write("\n")


def main():
    parser = argparse.ArgumentParser(description="Save current LoL game data to JSON")
    parser.add_argument("--output", type=Path, default=Path("lol_game_data.json"))
    parser.add_argument(
        "--interval",
        type=float,
        default=0,
        help="Refresh every N seconds; omit for a single snapshot",
    )
    args = parser.parse_args()
    if args.interval < 0:
        parser.error("--interval must be zero or greater")

    try:
        while True:
            try:
                data = fetch_game_data()
                save_game_data(data, args.output)
                players = data.get("allPlayers", [])
                game_time = data.get("gameData", {}).get("gameTime")
                print(
                    f"Saved {len(players)} players"
                    + (f" at {game_time:.0f}s" if isinstance(game_time, (int, float)) else "")
                    + f" to {args.output}",
                    flush=True,
                )
            except (HTTPError, URLError, TimeoutError, OSError, ValueError) as error:
                print(f"Could not read live game data: {error}", file=sys.stderr, flush=True)
                if args.interval == 0:
                    return 1

            if args.interval == 0:
                return 0
            time.sleep(args.interval)
    except KeyboardInterrupt:
        print("Stopped.")
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
