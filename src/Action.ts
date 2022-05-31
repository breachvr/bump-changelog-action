import * as core from '@actions/core';

/**
 * Action goes here
 */
class Action {

    constructor() { }

    public async Run() { }
}

try {
    new Action().Run();
} catch (error: any) {
    core.setFailed(error.message);
}