+++
title = "Operation Error: Aurelia 2"
authors = ["Dwayne Charrington"]
description = "Detailing work on improving error documentation and handling in Aurelia 2."
date = 2025-04-22T00:00:00+10:00
lastmod = 2025-04-22T09:00:00+10:00
tags = ["aurelia2"]
+++

Hello everyone, we are excited to detail some of the work we've been doing on improving error handling and documentation in Aurelia 2.

# What is Operation Error?

For a very long time, we have been wanting to improve the error handling and documentation in Aurelia 2. If you have ever had to visit the Aurelia 2 docs to find out how to handle an error, you will know that it is not always clear or documented at all. We have a [dedicated error section](https://docs.aurelia.io/developer-guides/error-messages) in the docs, but usually the docs are light on details and not very helpful (telling you how to debug or what to do next).

Not only should the docs be better (and actually exist), but we also want to make it easier to get to those docs when you are looking for help.

When an error occurs in Aurelia 2, we want to make sure that you can easily find the information you need to fix the error. We've had this idea for a while, but we never got around to implementing it until now. When an error occurs, we will now provide a link to the relevant section of the docs you can read to help you fix the error. It's a minor thing, but it will go a long way to helping you get the information you need to fix the error.

For this to work, we need to make sure that all errors are documented. While this is a big task and a work in progress, we are slowly getting there. The plan is to incrementally add more errors to the docs as we go along and release them instead of waiting until we have all the errors documented.

# Why is this important?

We want to make it easier to get the information you need to fix errors. At present, the Aurelia 2 docs are not very helpful when it comes to errors. We want to change that. You shouldn't have to dive into the source code or spend hours trying to figure out what the error means and how to fix it. The docs should be your first port of call and in most cases, the answer you need will be there.

# What about the stable release of Aurelia 2?

We have an update coming on the stable release of Aurelia 2, especially around the roadmap and some of the features we are working on. This will be in a separate blog post, so stay tuned for that.
