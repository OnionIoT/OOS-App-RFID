#!/bin/sh

## global variables
TOPIC="/console/rfid"
BASEDIR=$(dirname "$0")
ACCEPTED_FILE="$BASEDIR/accepted.lst"
DENIED_FILE="$BASEDIR/denied.lst"



## functions
usage () {
	echo "Functionality:"
	echo "	Read RFID tags and post to mqtt topic"
	echo ""
	echo "Usage:"
	echo "	$0"
	echo ""
}

# read all rfid tags in range and return just the UIDs - one per line
readRfid () {
	# read all rfid cards in range
	output=$(nfc-list | grep UID | sed -e 's/ //g' -e 's/^.*://')

	echo "$output"
}

# check tags against the files
#	arg1 - scan results
checkTags () {
	local tags="$1"
	local line=1
	local tag=$(echo "$tags" | sed -n "${line}p")

	local status=""
	local msg=""

	while [ "$tag" != "" ]
	do
		# check if accepted or denied
		if 	[ -e $ACCEPTED_FILE ] &&
				[ -e $DENIED_FILE ];
		then
			accepted=$(grep -i $tag $ACCEPTED_FILE)
			denied=$(grep -i $tag $DENIED_FILE)

			if [ "$accepted" != "" ]; then
				status="accepted"
				img="$ACCEPTED_DRAW"
			elif [ "$denied" != "" ]; then
				status="denied"
				img="$DENIED_DRAW"
			else
				status="unknown"
				img="$UNKNOWN_DRAW"
			fi
		else
			status="detected"
		fi

		## report the status:
		# on the command line
		#echo "$status: $tag"
		# on mqtt
		msg="{\"status\":\"$status\", \"tag\":\"$tag\"}"
		# echo "$msg"
		mosquitto_pub -t "$TOPIC" -m "$msg"

		# increment the line number
		line=$((line + 1))
		# read the next tag
		tag=$(echo "$tags" | sed -n "${line}p")
	done
}



## parse arguments
while [ "$1" != "" ]
do
	case "$1" in
		*)
				usage
				exit
			;;
	esac
done



## main program
echo "Scanning for tags started! Bring tag close to RFID Expansion"

while [ 1 ]; do
	results=$(readRfid)

	if [ "$results" != "" ]; then
		checkTags "$results"
	fi

	#sleep 1
done
