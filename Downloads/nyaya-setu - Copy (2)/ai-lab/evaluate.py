import json
from pathlib import Path


def main() -> None:
    cases_path = Path(__file__).with_name("test-cases.json")
    data = json.loads(cases_path.read_text(encoding="utf-8"))
    print(f"Loaded {len(data['cases'])} synthetic test cases.")
    print("Prompt evaluation is not implemented yet.")


if __name__ == "__main__":
    main()
