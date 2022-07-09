# $1 - submission id
# $2 - timeout

#? create jail directory
mkdir jail-submission-$1
cd jail-submission-$1
mkdir -p bin lib64/x86_64-linux-gnu lib/x86_64-linux-gnu

mv ../$1.sh ./program.sh
mv ../$1-data ./data
mkdir ./results

#? execute jail command
unshare -n -m "./program.sh"

#? check out
# STATUS=$?

# if test $STATUS -eq 124
# then
# 	echo "TIMEOUT-$1" > test.o
# fi

#? clean up and move outout to the parent directory
mv ./results ../$1-results
cd ..
rm -rf ./jail-submission-$1/