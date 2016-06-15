#!/bin/bash

# tackle two things
# 1. replace four variables. {PROJECT} {AUTHOR} {PORT} {COMPANY}   in all files
# 2. company dir's name  change to {COMPANY} , project dir's name change to {PROJECT}

COMPANY=$1
PROJECT=$2
AUTHOR=$3
PORT=$4

init()
{
	echo  "current working directory is : "
	pwd

	echo  "now it is: "
	date

	echo "welcome to easnynode!"
}

init

readin()
{
	echo "Please input company'name:"
	read COMPANY
	COMPANY="$(echo $COMPANY | tr '[:upper:]' '[:lower:]')"


	echo "Please input project'name:"
	read PROJECT
	PROJECT="$(echo $PROJECT | tr '[:upper:]' '[:lower:]')"


	echo "Please input http server's port:"
	read PORT

	echo "Please input author's name:"
	read AUTHOR
}

readin


replacedir()
{
	if test -e $PWD/src/company/project
		then
	        mv src/company/project src/company/$PROJECT
			if test -d $PWD/src/company
				then
					mv src/company/ src/$COMPANY
			else
				echo $PWD/src/company not exist
			fi
	else
		echo $PWD/src/company/project not exist
	fi
}

replacedir

replace()
{
	sed  -i -e  s/{PROJECT}/$PROJECT/g  `grep {PROJECT} -rl .`

	sed  -i -e  s/{COMPANY}/$COMPANY/g  `grep {COMPANY} -rl .`

	sed  -i -e  s/{AUTHOR}/$AUTHOR/g  `grep {AUTHOR} package.json`

	sed  -i -e  s/{PORT}/$PORT/g  `grep {PORT} bin/start_servers.h`
}

replace


print()
{
	echo 'Company:' $COMPANY
	echo 'Project:' $PROJECT
	echo 'AUTHOR:' $AUTHOR
	echo 'PORT:' $PORT
}

print
