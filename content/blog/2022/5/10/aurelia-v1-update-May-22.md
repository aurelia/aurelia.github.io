+++
title = "Aurelia v1 updates for May 2022"
authors = ["bigopon"]
description = "New versions for Aurelia v1 packages, & upgrade notes"
date = 2022-05-10T11:20:13.243Z
lastmod = 2022-05-10T11:20:13.243Z
+++

Most of the v1 core packages have been updated to use latest dependency versions, resolve vulnverable dependency issues and produce smaller bundle output. We will be continuing our effort in this space for the rest of the core modules.

One of the packages that recently got an update is `aurelia-testing`. A new version `1.1.0` has been released. With this, it'll be lighter weight and friendlier to bundler. Though if you had an existing application that was created with `aurelia-testing@1.0.0` and the following webpack configuration:

```ts
new ModuleDependenciesPlugin({
  'aurelia-testing': ['./compile-spy', './view-spy']
})
```

you will see an issue like this when upgrading:

```
Module not found: Error: Can't resolve './compile-spy' in '~\app\node_modules\aurelia-testing\dist\native-modules'

Module not found: Error: Can't resolve './view-spy' in '~\app\node_modules\aurelia-testing\dist\native-modules'
```

A simple way to resolve this is to remove those 3 configuration lines, as they are no longer needed for `aurelia-testing@1.1.0` onwards.

Thanks to [steenburgh](https://github.com/steenburgh) for helping with this issue.

## Until next time

As always, thank you for all the feedback and contribution on both v1 and v2. We can't wait to finally get Aurelia 2 out there into the wild in its more completed form.

If you ever have any questions or issues, please don't hesitate to reach out. The best place to ask questions is on the [Aurelia Discourse](https://discourse.aurelia.io/) and any bugs or feature requests on [the Aurelia GitHub](https://github.com/aurelia/aurelia/issues). Or maybe just come over to the [Aurelia Discord channel for some chat](https://discord.gg/RBtyM6u).