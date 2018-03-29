#!/usr/bin/env python

import re
import os
import sys
import json
import zipfile
import requests

config = json.loads(open(os.path.dirname(sys.argv[0]) + '/update_config.json', 'r').read()) # Load config

mode = config['mode']

if mode != 'developer' and mode != 'stage' and mode != 'production':
    print 'mode has to be one of: \'developer\', \'stage\' or \'production\''
    sys.exit(1)

url = config['url'] # 'https://api.github.com/repos/ByzanceIot/becki/releases/latest'
headers = {'Authorization': 'token ' + config['api_key']}

print 'Making request to ', url

response = requests.get(url, headers = headers)

if response.status_code != 200:
    print 'Request was unsuccessful'
    print response.text
    sys.exit(1)

release = response.json()

if len(release['assets']) == 0:
    print 'Release does not contain any asset'
    sys.exit(1)

for index, asset in enumerate(release['assets']):
    if asset['name'] == 'dist.zip':
        asset_url = asset['url']
        break
    elif index == len(release['assets']) - 1:
        print 'Cannot found any asset named dist.zip'
        sys.exit(1)

current = open(os.path.dirname(sys.argv[0]) + '/current_version', 'r+')
new = release['tag_name']

if mode == 'developer':
    if not re.search('^(v)(\d+\.)(\d+\.)(\d+)((-alpha|-beta)((\.\d+){0,3})?)?$', new):
        print 'No new version for this mode was found'
        sys.exit(1)
elif mode == 'stage':
    if release['draft'] or not re.search('^(v)(\d+\.)(\d+\.)(\d+)((-beta)((\.\d+){0,3})?)?$', new):
        print 'No new version for this mode was found'
        sys.exit(1)
elif mode == 'production':
    if release['draft'] or release['prerelease'] or not re.search('^(v)(\d+\.)(\d+\.)(\d+)$', new):
        print 'No new version for this mode was found'
        sys.exit(1)

current_version = current.read()

print 'Current version:', current_version
print 'Potential new version:', new

currentDash = current_version.find('-')
currentSuffix = None
currentSuffixNumbers = None

if currentDash != -1:
    currentVersionNumbers = current_version[1:currentDash].split('.')
    tempCurrent = current_version[currentDash + 1:]
    currentFirstDot = tempCurrent.find('.')
    if currentFirstDot != -1:
        currentSuffixNumbers = tempCurrent[currentFirstDot + 1:].split('.')
        currentSuffix = tempCurrent[:currentFirstDot]
    else:
        currentSuffix = current_version[currentDash + 1:]
else:
    currentVersionNumbers = current_version[1:].split('.')

print 'Current version numbers:', currentVersionNumbers, 'suffix:', currentSuffix

newDash = new.find('-')
newSuffix = None
newSuffixNumbers = None

if newDash != -1:
    print 'Found dash in new version'
    newVersionNumbers = new[1:newDash].split('.')
    tempNew = new[newDash + 1:]
    newFirstDot = tempNew.find('.')
    if newFirstDot != -1:
        print 'Found dot in suffix on index:', newFirstDot
        newSuffixNumbers = tempNew[newFirstDot + 1:].split('.')
        print 'New suffix numbers:', newSuffixNumbers
        newSuffix = tempNew[:newFirstDot]
        print 'New suffix:', newSuffix
    else:
        newSuffix = new[newDash + 1:]
else:
    newVersionNumbers = new[1:].split('.')

print 'New version numbers:', newVersionNumbers, 'suffix:', newSuffix

print 'Comparing versions'

for index in range(len(newVersionNumbers)):
    versionNumber = int(newVersionNumbers[index])
    currentNumber = int(currentVersionNumbers[index])

    print 'Compare version numbers: new:', versionNumber, 'current:', currentNumber

    if versionNumber > currentNumber:
        print 'Base version is higher - updating'
        break

    if versionNumber <= currentNumber and index == len(newVersionNumbers) - 1:
        print 'Base version is not higher - checking suffix'

        if (currentSuffix is not None and (newSuffix is None or newSuffix is '')) or (currentSuffix == 'alpha' and newSuffix == 'beta'):
            print 'Suffix version is higher - updating'
            break

        elif currentSuffix == newSuffix:
            print 'Suffix version is same - comparing subversion'
            if (currentSuffixNumbers is None and newSuffixNumbers is None) or (currentSuffixNumbers is not None and newSuffixNumbers is None):
                print 'Version is not higher - not updating'
                sys.exit(1)
            if (currentSuffixNumbers is None and newSuffixNumbers is not None) or (len(currentSuffixNumbers) == 0 and len(newSuffixNumbers) > 0):
                print 'Subversion is higher - updating'
                break
            do_update = False
            for index in range(len(currentSuffixNumbers)):
                currentSuffixNumber = int(currentSuffixNumbers[index])
                if index < len(newSuffixNumbers):
                    newSuffixNumber = int(newSuffixNumbers[index])

                    print 'Compare subversion numbers: new:', newSuffixNumber, 'current:', currentSuffixNumber

                    if (newSuffixNumber > currentSuffixNumber) or (newSuffixNumber == currentSuffixNumber and index == len(currentSuffixNumbers) - 1 and len(currentSuffixNumbers) < len(newSuffixNumbers)):
                        print 'Subversion is higher - updating'
                        do_update = True
                        break

        if do_update:
            break
        print 'Version is not higher - not updating'
        sys.exit(1)

headers2 = {'Authorization': 'token ' + config['api_key'], 'Accept': 'application/octet-stream'}
package = requests.get(asset_url, headers = headers2)

with open(os.path.dirname(sys.argv[0]) + '/dist.zip', 'w') as fd:
    for chunk in package.iter_content(chunk_size=128):
        fd.write(chunk)

print 'File was downloaded'

with zipfile.ZipFile(os.path.dirname(sys.argv[0]) + '/dist.zip') as zip:
    zip.extractall()
    zip.close()

print 'File was extracted'

current.seek(0)
current.truncate(0)
current.write(new)
current.close()

os.system('service nginx reload')

print 'Update successful'
sys.exit(0)
