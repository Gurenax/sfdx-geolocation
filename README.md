# SFDX  App

## Setup
1. Created the project
```
sfdx force:project:create -n sfdx-geolocation
cd sfdx-geolocation
```

2. Create a scratch org with the alias GeoAppScratch:
```
sfdx force:org:create -s -f config/project-scratch-def.json -a GeoAppScratch
```

3. Open scratch org
```
sfdx force:org:open
```

4. Create custom fields as instructed in:
```
https://trailhead.salesforce.com/trails/sfdx_get_started/modules/sfdx_app_dev/units/sfdx_app_dev_create_app
```

5. Assign permission set to user:
```
sfdx force:user:permset:assign -n Geolocation
```

6. Pull Changes into Your Project
```
sfdx force:source:pull
```


---

## Dev, Build and Test


## Resources


## Description of Files and Directories


## Issues


