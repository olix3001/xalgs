import datetime
import os
import shutil
from language_processor import LanguageProcessor

class PythonProcessor(LanguageProcessor):
    def process(self, submissionId: int, testCount: int, timeLimit: int, idmap: dict) -> bool:
        isFullSuccess = True
        for ti in range(testCount):
            testId = str(submissionId) + "-" + str(ti)
            datadir = f'./{str(submissionId)}-data'
            print(f'  > Running test {ti}')
            # copy input
            print(f'   > Copying test input and code')
            os.mkdir(f'{testId}-files')
            os.rename(f'{datadir}/test-{str(ti)}.i', f'./{testId}-files/test.i')

            shutil.copyfile(f'{datadir}/code.f', f'./{testId}-files/code.py')
            # run test
            print(f'   > Running program')
            os.system(f'sh ./createJail.sh {testId}')
            starttime = datetime.datetime.now()
            run_res = os.system(f'cd jail-submission-{testId} && su && timeout {str(timeLimit)} unshare -Umnr python3 code.py < ./test.i > ./test.o')
            endtime = datetime.datetime.now()
            os.system(f'sh ./exitJail.sh {testId}')

            # check if everything is correct
            exec_time = (endtime - starttime).total_seconds() * 1000
            if exec_time >= timeLimit*1000:
                print(f'   > test {str(ti)} timeout after {exec_time}ms')
                self.add_result(submissionId, idmap[ti], False, exec_time, 0, "TIMEOUT")
                isFullSuccess = False
                os.remove(f'./test-{testId}.o')
                continue

            if run_res != 0:
                print(f'   > test {str(ti)} runtime error after {exec_time}ms')
                self.add_result(submissionId, idmap[ti], False, exec_time, 0, "RUNTIME ERROR")
                isFullSuccess = False
                continue

            if self.compare(f'./test-{testId}.o', f'{datadir}/test-{str(ti)}.eo'):
                print(f'   > test {str(ti)} passed successfully in {exec_time}ms')
                self.add_result(submissionId, idmap[ti], True, exec_time, 0)
            else:
                print(f'   > test {str(ti)} failed after {exec_time}ms')
                self.add_result(submissionId, idmap[ti], False, exec_time, 0, "WRONG ANSWER")
                isFullSuccess = False

            os.remove(f'./test-{testId}.o')

        return isFullSuccess