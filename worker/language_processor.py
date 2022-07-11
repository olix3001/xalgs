from copyreg import constructor
from typing import Callable, Optional

class LanguageProcessor:
    def __init__(self, add_result: Callable[[int, int, bool, int, int, Optional[str]], None]) -> None:
        self.add_result = add_result

    def process(self, submissionId: int, testCount: int, timeLimit: int, idmap: dict) -> bool:
        pass
    
    def compare(self, baseline: str, newestFile: str) -> bool:
        af = open(baseline)
        bf = open(newestFile)

        lines1 = list(map(lambda e: e.replace('\n', ''), af.readlines()))
        lines2 = list(map(lambda e: e.replace('\n', ''), bf.readlines()))

        af.close()
        bf.close()
        return lines1 == lines2