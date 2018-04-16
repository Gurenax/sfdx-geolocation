# SFDX  App

## Setup
1. Created the project
```
sfdx force:project:create -n sfdx-geolocation
cd sfdx-geolocation
```

2. Best practice, add `.sfdx` folder to `.gitignore` file
```
# Ignore sfdx folder
.sfdx
```

3. Push to GitHub
```
git init
git add -A "Initialise project with sfdx"
git push origin master
```

4. Create a scratch org with the alias GeoAppScratch:
```
sfdx force:org:create -s -f config/project-scratch-def.json -a GeoAppScratch
```

5. Open scratch org
```
sfdx force:org:open
```

6. Create custom fields as instructed in:
```
https://trailhead.salesforce.com/trails/sfdx_get_started/modules/sfdx_app_dev/units/sfdx_app_dev_create_app
```

7. Assign permission set to user:
```
sfdx force:user:permset:assign -n Geolocation
```

8. Pull Changes into Your Project
```
sfdx force:source:pull
```

9. Best practice, push all changes to GitHub
```
git add -A
git commit -m "Add custom object and permset"
git push origin master
```

10. Create Sample Data as instructed in:
```
https://trailhead.salesforce.com/trails/sfdx_get_started/modules/sfdx_app_dev/units/sfdx_app_dev_create_app
```

11. Create data folder
```
mkdir data
```

12. Export the created sample data:
```
sfdx force:data:tree:export -q "SELECT Name, Location__Latitude__s, Location__Longitude__s FROM Account WHERE Location__Latitude__s != NULL AND Location__Longitude__s != NULL" -d ./data
```

---

## Dev, Build and Test


## Resources


## Description of Files and Directories


## Issues


