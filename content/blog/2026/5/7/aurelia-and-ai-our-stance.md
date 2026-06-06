+++
title = "Aurelia and AI: Where We Stand"
authors = ["Dwayne Charrington"]
description = "Plenty of open source projects are closing the door on AI contributions. Aurelia is not one of them. Here is what we expect instead."
date = 2026-05-07T10:00:00+10:00
lastmod = 2026-05-07T10:00:00+10:00
tags = ["aurelia2", "ai", "community", "contributing"]
+++

Over the past year a number of well known open source projects have drawn a hard line on AI. The
reasons are understandable, and in a lot of cases the maintainers were right to act. But Aurelia is
going to take a different position, and we want to be clear about it.

The Aurelia team is pro-AI.

That sentence is going to upset some people, so let us explain what we mean and, just as importantly,
what we do not mean.

## Why projects are closing up

The shift has been hard to miss. In January 2026, curl shut down its six year old bug bounty program
because the security team was being buried in AI generated vulnerability reports. The maintainers
described long, confident, completely fabricated submissions. By late 2025 only around one in twenty
to one in thirty reports were real, down from roughly one in six a year earlier. Daniel Stenberg
called it an attempt to remove the incentive for submitting made up lies.

He is not alone. Ghostty moved to a zero tolerance policy, only allowing AI assisted contributions
for pre approved issues and existing maintainers. tldraw started auto closing external pull requests.
At the distribution level, Gentoo forbids contributions created with the assistance of natural
language processing tools, NetBSD treats LLM generated code as presumed tainted and off limits
without prior written approval, and QEMU rejects code known or even suspected to have been produced
by an LLM. There is now even a maintained index of projects that reject AI generated code.

We get it. When you maintain something critical and the queue fills with plausible looking nonsense
faster than humans can triage it, the only practical lever is to close the door. That is not
anti-progress. It is self defense.

## Our position

We do not think the answer for Aurelia is to ban a category of tool.

We care about one thing: the quality of what lands in the framework and its packages. How you got
there is your business. Whether a change was hand written, drafted by an agent, or somewhere in
between does not change the bar it has to clear. Every submission is held to the same standard.

That cuts both ways. A pull request being AI assisted is not a mark against it. A pull request being
hand coded does not earn it a pass. We review the code, the tests, the reasoning, and the impact on
the rest of the framework. The provenance is not the point. The result is.

It is worth noting that curl itself came back to HackerOne about a month after shutting the program
down. The models had improved and the quality of real reports went up. That is roughly how we see the
trajectory too. The tooling keeps getting better, and treating a whole class of contributor as guilty
by default ages badly.

There is a reason we lean this way. We already shipped [skills for AI coding
agents](/blog/2026/6/6/aurelia-skills-for-ai-coding-agents/) so that tools like Claude Code and Codex
have proper Aurelia 2 context instead of guessing from old examples. We want people building on
Aurelia with whatever tools make them productive. Closing the door on those same tools at
contribution time would be inconsistent.

## This is not a licence to submit slop

Being pro-AI is not an invitation to throw generated code over the wall and hope a maintainer cleans
it up. That is the behaviour that broke things for everyone else, and we are not interested in
inheriting it.

If you open a pull request, you own it. You are vouching for it. Saying an agent wrote it is not an
explanation for why it is wrong, untested, or subtly breaks an edge case you never checked. The Linux
kernel landed on a sensible version of this: AI code is allowed, but the human who submits it is on
the hook for it. We feel the same way.

So before you open that pull request:

- Understand the change. If you cannot explain what it does and why, it is not ready.
- Run it. Make sure `npm run build` passes and the relevant tests are green.
- Add tests for new behaviour. Generated code that changes behaviour without coverage is not done.
- Keep it scoped. Sprawling, speculative refactors are hard to review no matter who or what wrote
  them.
- Do not paste a wall of confident prose into the description. Tell us what changed and how you know
  it works.

None of this is new. It is the same thing we have always asked of contributors. AI just makes it
easier to produce a lot of output quickly, which means it is easier than ever to produce a lot of
output that looks finished and is not.

## The standard is the standard

If a change improves Aurelia, is well tested, fits the architecture, and does not compromise the
framework or its packages, we want it. We genuinely do not care whether you typed every character or
worked alongside an agent to get there.

If a change is sloppy, untested, or does not hold up under review, it gets the same response it would
have a decade ago, regardless of how it was produced.

That is the whole policy. Use the tools. Hold yourself to the bar. We will meet you there.

---

Sources and further reading:

- [The end of the curl bug-bounty (daniel.haxx.se)](https://daniel.haxx.se/blog/2026/01/26/the-end-of-the-curl-bug-bounty/)
- [Drowning in AI slop, cURL ends bug bounties (The New Stack)](https://thenewstack.io/drowning-in-ai-slop-reports-curl-ends-bug-bounties/)
- [We're Losing Open Contribution (Continue Blog)](https://blog.continue.dev/were-losing-open-contribution)
- [Linux distros ban 'tainted' AI-generated code (Tom's Hardware)](https://www.tomshardware.com/software/linux/linux-distros-ban-tainted-ai-generated-code)
- [Linux Kernel Permits AI Code, Pins Liability on the Human (implicator.ai)](https://www.implicator.ai/linux-didnt-approve-ai-kernel-code-it-made-the-human-submitter-the-fuse/)
- [slopfree-software-index (Codeberg)](https://codeberg.org/brib/slopfree-software-index)
