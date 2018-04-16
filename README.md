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

## Resources


## Description of Files and Directories


## Issues


