#!/usr/bin/env sh
set -e
echo "Enter Release Version: "
read "$VERSION"
read -p "Release $VERSION - are you sure? (y/n)" -n -1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]];
then
    echo "Releasing $VERSION"

    #commit
    git add -A
    git commit -m "[build] $VERSION"
    npm version $VERSION --message "[release] $VERSION"
    git push origin master

    #publish
    npm publish
fi
