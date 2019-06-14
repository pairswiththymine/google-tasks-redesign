# Google Tasks Redesign

## Preface
About 5 months ago I discovered the Google tasks app. I am a massive fan of the new style they are going for and wanted to use it as my todo app for a while. However there were a few issues I had with it such as the lack of reoccurring events. However more pressingly there was no desktop app. I am someone who works constantly on a desktop or laptop and I do not typically like to have my phone with me when working, furthermore I do not like distractions thus the mixed application style Google has started making with tasks off to one side and gmail or Google calendar in focus does not work for me. So the lack of a way to access google tasks independently of anything else was the last nail in the coffin. Which is a real shame because this app looks beautiful.

---

## Problem
I really love the phone app, it is beautiful, incredably nice to use, and I could gush about it for years. I decided to make this application as though I worked at Google. There already exists [at least one](https://github.com/KarafiziArtur/react-google-tasks) webapp interface for Google tasks however it does not follow material 2.0 design system.

---

## Goals & Solution
My primary goals for this project are to buff my portfolio, and learn. This is a relatively large endevor due to the fact that I have very little time to work on this so the timeframe is undefined however by the end of it I want to have a fully functional desktop alternative to Google tasks that feels like Google could have made it.

---

## Discovery
On loading the app (viewed from gmail) you are greeted with this:

![On first launch](./discovery/on-first-launch.png)

I am going to go ahead and assume that the lack of any greeting was due to the my previous expirements with this app. This shows a nice illustration with very clear actions a user could take:

* add a task
* close the sidebar (this is still gmail)
* show a dropdown of the all lists a user has.
* get more options.

This is incredibly simple by design.

Adding a task does a little animation to transition from wide sholdered cake man to a functional application. A simple text box in which to add a task is shown with the hallmarks of a "task item" such as the unchecked circle and editing menu button.

Upon clicking this button you are taken to this page that shows all the options you are given to provide more context to your task. Once again I note the simplicity of this design. Nothing is too overbearing, just 2 simple text fields, a dropdown, date picker, and a way of creating subtasks.

![Edit task](./discovery/edit-task.png)

When creating a subtask the "task item" ui theme is kept consistent.

![Subtask](discovery/subtask.png)

This is the same component with a few noticeable changes: 
* there is no edit menu
* there is a helpful little arrow
* there are two small breaks in the circle at lower resolutions
    I am not sure if this is intentional or simply a rendering glitch as it only shows when my monitor is in 1080p. I am going to treat it as such

When returning to the main menu the subtask is shown nested below the parent task.

![Subtask Main](discovery/subtask-main.png)

When adding details to the parent task those are also shown in the task list.

![Details](discovery/details-and-subtask.png)

When adding a date to the task that is also shown.

![Date](discovery/date.png)

At this point there is quite a bit of data shown here and it is still not really overwhelming and easily scanable. But this is about it for this app. This is the meat of what it does. There are several other features such as keyboard shortcuts that improve the poweruser's expirence. However this is really most of it.

---

## sketches

Typically the next step would have been to identify user personas, and other such planning phases. However my goal was not to redesign google tasks, it was to recreate the mobile version for desktop. So I do not want to add any extra features (despite there being a few that I would really like.) So knowing this I jumped straight to some brainstorming.

![Brainstorming](discovery/brainstorming.png)

In this process I came accross a few things of note: first is that due to the amount of data being displayed, a desktop version of this application is really unnecessary. I found this when doing some of the first drafts, I took the approch of every other desktop todo app on the planet, a list to the left with details in the main container. This is not ideal, as it looks like and behaves just like the gmail version except it can show the main task list at the same time. Next I tried moving the task list to the center, and having a detail popup, once again this struck me as shockingly similar to the original design. However this gave me an idea, in the original application the concept of a "task item" was a unifying feature. So I thought about constructing this into both the task and the details. The primary advantage to having a desktop design is screen realistate. So what if I expanded the task item into a more detailed view. Then I realized that I can simply always show details while having the list layed out similar to Google keep

![keep](discovery/keep.png)

Now each task could be a task that could be minimized. This allows for a simple overview of your tasks and a space effective design. Alternately I could make it as tasks are minimized by default, however I believe that will come in higher fidelity prototypes.

---

## low fidelity prototype

I prefer to use raw html to create low fidelity prototypes and wireframes. I find it extremely easy to see what I am doing and there is the benefits of being able to resize the page, and provide very simple interactions. This is a somewhat controversial point of view however I must stress I am not creating the website, or even the foundation to the website, infact this will have absolutely no functionality, I simply want to get a feel for the layout.

[The wireframe](https://s.codepen.io/Alexa42/debug/pXjrZq/VGkWNwmPobjA)

Obviously there is *a lot* wrong with this. Primarily the issues consist of the jaring transition between showing details of a task and them being hidden. Furthermore the grid system really needs to be more robust. However it gets across the general idea I am going for: a header with all of the standard Google things, a sidebar with task lists, and the tasks front and center.


## high fidelity prototype

Next comes my favorite part: making it all look pretty. Because I am designing this not only following the material 2.0 guidelines, but also attempting to look as though Google created this app. Thus their specific imagining of material 2.0 is what I will be attempting to recreate.

![mockup](design/initial-mockup.png)

[link](https://s.codepen.io/Alexa42/debug/zVvEZK/VJrxxVBeqDyr)

There are several things of note here, firstly I am using Product Sans as the font instead of Google Sans, next there is no actual data going in here, it is just static html with styles.