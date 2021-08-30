npm install

/usr/bin/sudo sed -i "s/{{cypress_run_files}}/$1/g" .sauce/config-testmodeller.yml

#/usr/bin/sudo saucectl configure -u <user_id> -a <api_key>

/usr/bin/sudo saucectl run -c .sauce/config-testmodeller.yml

/usr/bin/sudo /usr/bin/dotnet SauceLabsCtl2Modeller/SauceLabsCtl2Modeller.dll publish -u "<modeller_url>" -a "<modeller_key>" -f  "saucectl-report.xml" -d "artifacts"
echo "finished"