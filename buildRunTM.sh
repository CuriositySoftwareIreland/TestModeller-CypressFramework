npm install

/usr/bin/sudo /usr/bin/docker run --rm -v "$1:/e2e" -w /e2e --entrypoint /bin/bash --ipc=host cypress/included:5.4.0 -c "npm run cypress:run --testSpec='--spec cypress/integration/$2/**/*'"

echo "finished"