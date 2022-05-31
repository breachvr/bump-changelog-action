import * as core from '@actions/core';
import * as fs from 'fs';

const unreleased_pattern = /^##\s\[[Uu]nreleased\]\s$/gm;

/**
 * Action goes here
 */
class Action {

    constructor() { }

    public async Run() {
        const path = core.getInput('path');
        const next_version = core.getInput('version');
        const repository = core.getInput('repository');

        if (!fs.existsSync(path)) {
            console.log('No file found on ' + path);
            throw new Error('No file found on ' + path);
        }

        let changelog = fs.readFileSync(path, { encoding: 'utf8'});
        if (!changelog) {
            console.log('Changelog not a valid file');
            throw new Error('Not able to parse changelog file');
        }

        const matches = changelog.match(unreleased_pattern);
        if (!matches) {
            console.log('No [Unreleased] tag found in changelog.md');
            throw new Error('No [Unreleased] header found in changelog');
        }

        const release_string = `## [[\`${ next_version }\`](https://github.com/${ repository }/releases/tag/${ next_version })] - ${ new Date().toISOString().split('T')[0] }`;
        const new_section = `## [Unreleased]

### Added

### Changed

### Removed

### Fixed

${ release_string }
`;
        const updated_content = changelog.replace(unreleased_pattern, new_section);

        fs.writeFileSync(path, updated_content, { encoding: 'utf8' });
    }
}

try {
    new Action().Run();
} catch (error: any) {
    core.setFailed(error.message as string);
}