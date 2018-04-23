# SFDX Geolocation App
- A salesforce dx geolocation app created from scratch.

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
git add -A
git commit -m "Initialise project with sfdx"
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

### Create the App
1. Create `Apex Controller Class`
```
sfdx force:apex:class:create -n AccountController -d force-app/main/default/classes
```

2. Modify `AccountController.cls`
```java
public with sharing class AccountController {
  @AuraEnabled
  public static List<Account> findAll() {
  return [SELECT Id, Name, Location__Latitude__s, Location__Longitude__s
          FROM Account
          WHERE Location__Latitude__s != NULL AND Location__Longitude__s !=
          NULL
          LIMIT 50];
  }
}
```

3. Push changes to scratch org
```
sfdx force:source:push
```

4. Create `Lightning Component`
```
sfdx force:lightning:component:create -n AccountLocator -d force-app/main/default/aura
```

5. Modify `AccountLocator.cmp`
```html
<aura:component implements="force:appHostable">
  <div>
    <div>AccountMap goes here</div>
    <div>AccountList goes here</div>
  </div>
</aura:component>
```

6. Modify `AccountLocator.css`
```css
.THIS {
  position:absolute;
  height: 100%;
  width: 100%;
  background: #FFFFFF;
}
.THIS>div {
  height: 50%;
}
```

7. Push source to scratch org
```
sfdx force:source:push
```

8. Set Up a Tab to Open the Lightning Component as instructed in:
```
https://trailhead.salesforce.com/trails/sfdx_get_started/modules/sfdx_app_dev/units/sfdx_app_dev_build_app
```

9. Pull the custom tab changes from the scratch org
```
sfdx force:source:pull
```

10. Create `AccountListItem` lightning component
```
sfdx force:lightning:component:create -n AccountListItem -d force-app/main/default/aura
```

11. Modify `AccountListItem.cmp`
```html
<aura:component>
  <aura:attribute name="account" type="Account"/>
  <li><a>{!v.account.Name}</a></li>
</aura:component>
```

12. Modify `AccountListItem.css`
```css
.THIS {
    border-bottom: solid 1px #DDDDDD;
}
.THIS a {
    display: block;
    padding: 20px;
    color: inherit;
}
.THIS a:active {
    background-color: #E8F4FB;
}
```

13. Create `AccountList` lightning component
```
sfdx force:lightning:component:create -n AccountList -d force-app/main/default/aura
```

14. Modify `AccountList.cmp`
```html
<aura:component controller="AccountController">
    <aura:attribute name="accounts" type="Account[]"/>
    <aura:handler name="init" value="{!this}" action="{!c.doInit}" />
    <ul>
    <aura:iteration items="{!v.accounts}" var="account">
        <c:AccountListItem account="{!account}"/>
    </aura:iteration>
    </ul>
</aura:component>
```

15. Modify `AccountListController.js`
```javascript
({
  doInit: function(component, event) {
    var action = component.get('c.findAll')
    action.setCallback(this, function(a) {
      component.set('v.accounts', a.getReturnValue())
    })
    $A.enqueueAction(action)
  }
})
```

16. Modify `AccountList.css`
```css
.THIS {
  list-style-type: none;
  padding: 0;
  margin: 0;
  background: #FFFFFF;
  height: 100%;
}
```

17. Modify `AccountLocator.cmp` to use the `AccountList` component
```html
<aura:component implements="force:appHostable">
    <div>
        <div>AccountMap goes here</div>
        <div>
          <c:AccountList/>
        </div>
    </div>
</aura:component>
```

18. Push source to scratch org
```
sfdx force:source:push
```

19. Download [Leaflet](http://leafletjs.com/download.html) javascript library

20. Install in scratch org as instructed in:
```
https://trailhead.salesforce.com/trails/sfdx_get_started/modules/sfdx_app_dev/units/sfdx_app_dev_create_visuals
```

21. Pull the static resource from scratch org
```
sfdx force:source:pull
```

22. Create `AccountMap` lightning component
```
sfdx force:lightning:component:create -n AccountMap -d force-app/main/default/aura
```

23. Modify `AccountMap.cmp`
```html
<aura:component>
    <aura:attribute name="map" type="Object"/>
    <ltng:require styles="/resource/leaflet/leaflet.css"
        scripts="/resource/leaflet/leaflet.js"
        afterScriptsLoaded="{!c.jsLoaded}" />
    <div id="map"></div>
</aura:component>
```

24. Modify `AccountMapController.js`
```javascript
({
  jsLoaded: function(component, event, helper) {
    var map = L.map('map', { zoomControl: false }).setView([37.784173, -122.401557], 14)
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles © Esri'
      }).addTo(map)
    component.set('v.map', map)
  }
})
```

25. Modify `AccountMap.css`
```css
.THIS {
  width: 100%;
  height: 100%;
}
```

26. Update the `AccountLocator.cmp` to use `AccountMap` component
```html
<aura:component implements="force:appHostable">
    <div>
        <div>
            <c:AccountMap />
        </div>
        <div>
            <c:AccountList />
        </div>
    </div>
</aura:component>
```

27. Push changes to scratch org
```
sfdx force:source:push
```

28. Create `AccountsLoaded` Lightning Event to Add Markers to the Map
```
sfdx force:lightning:event:create -n AccountsLoaded -d force-app/main/default/aura
```

29. Modify `AccountsLoaded.evt`
```xml
<aura:event type="APPLICATION">
    <aura:attribute name="accounts" Type="Account[]"/>
</aura:event>
```

30. Modify `AccountList.cmp` to and add an event declaration and map attribute. The map attribute loads the Leaflet stylesheet from the scratch org's static resources.
```html
<aura:component controller="AccountController">
    <aura:registerEvent name="accountsLoaded" type="c:AccountsLoaded"/>
    <aura:attribute name="accounts" type="Account[]"/>
    <ltng:require styles="/resource/leaflet/leaflet.css" scripts="/resource/leaflet/leaflet.js" afterScriptsLoaded="{!c.doInit}" />
    <aura:handler name="init" value="{!this}" action="{!c.doInit}" />
    <ul>
    <aura:iteration items="{!v.accounts}" var="account">
        <c:AccountListItem account="{!account}"/>
    </aura:iteration>
    </ul>
</aura:component>
```

31. Modify `AccountsListController.js` to add the `AccountsLoaded` event
```javascript
({
    doInit : function(component, event) {
        var action = component.get("c.findAll");
        action.setCallback(this, function(a) {
            component.set("v.accounts", a.getReturnValue());
            var event = $A.get("e.c:AccountsLoaded");
            event.setParams({"accounts": a.getReturnValue()});
            event.fire();
        });
    $A.enqueueAction(action);
    }
})
```

32. Modify `AccountMap.cmp` to add the `AccountsLoaded` event handler
```html
<aura:component>
    <aura:attribute name="map" type="Object"/>
    <aura:handler event="c:AccountsLoaded" action="{!c.accountsLoaded}"/>
    <ltng:require styles="/resource/leaflet/leaflet.css"
        scripts="/resource/leaflet/leaflet.js"
        afterScriptsLoaded="{!c.jsLoaded}" />
    <div id="map"></div>
</aura:component>
```

33. Modify AccountMapController.js` to add the `accountsLoaded` function
```javascript
({
  jsLoaded: function(component, event, helper) {
    var map = L.map('map', { zoomControl: false }).setView([37.784173, -122.401557], 14)
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles © Esri'
      }).addTo(map)
    component.set('v.map', map)
  },
  accountsLoaded: function(component, event, helper) {
      // Add markers
      var map = component.get('v.map');
      var accounts = event.getParam('accounts');
      for (var i=0; i<accounts.length; i++) {
          var account = accounts[i];
          var latLng = [account.Location__Latitude__s, account.Location__Longitude__s];
          L.marker(latLng, {account: account}).addTo(map);
      }  
  }
})
```

34. Push changes to scratch org
```
sfdx force:source:push
```

### Validate the App
1. Create new scratch org
```
sfdx force:org:create -f config/project-scratch-def.json -a GeoTestOrg
```

2. Push local source and metadata to GeoTestOrg
```
sfdx force:source:push -u GeoTestOrg
```

3. Add permission set for GeoTestOrg
```
sfdx force:user:permset:assign -n Geolocation -u GeoTestOrg
```

4. Load sample data to GeoTestOrg
```
sfdx force:data:tree:import -f data/Account.json -u GeoTestOrg
```

5. Open GeoTestOrg
```
sfdx force:org:open -u GeoTestOrg
```

## Resources

- Leaflet
  - http://leafletjs.com/download.html

## Description of Files and Directories


## Issues


