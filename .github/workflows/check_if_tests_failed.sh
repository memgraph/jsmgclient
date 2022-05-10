#!/bin/bash -e

# The file is not-empty and we must cat the result
if [ -s tests_output.txt ]; then
  cat tests_output.txt
  exit 1
fi

exit 0
