"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */
const formSubmit = $('#form')


async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="star">
          <i class="star-off">

          </i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

formSubmit.on('submit', submitStories)

async function submitStories() {
  const auth = $('#author')[0];
  const title = $('#title')[0];
  const url = $('#url')[0];
  await StoryList.addStory(currentUser, {title: title.value, author: author.value, url: `https://${url.value}`});
  getAndShowStoriesOnStart();
}

async function test() { 
  let newStory = await StoryList.addStory(currentUser,
    {title: "Test", author: "Me", url: "http://meow.com"});
}

$(document).ready(function(e) {
  $('html').css('display', 'none')
  setTimeout(getInfo, 1000);
  
})

function appendToSections(section) {
  console.log(section)
  return section
}

function getInfo() {
  const lis = document.children[0].children[1].children[1].children[1].children
  for (let li of lis) {
    const id = li.id;
    const stories = currentUser.favorites;
    for (let story of stories) {
      const storyId = story.storyId;
      if (storyId == id) {
        li.children[0].children[0].className = "star-on";
      }
    }
  }
  for (let i = 0; i < lis.length; i++) {
    if (lis[i].children[0].children[0].className == "star-on") {
      appendToSections(lis[i])
    }
  }

  $('html').css('display', 'block')
}

$('.stories-container.container').on('click', 'i', function(e) {
  const storyLi = e.target.closest('li');
  const story = storyList.stories.filter(value => {
    return value.storyId == storyLi.id;
  })
  if (e.target.className == "star-off") {
    e.target.className = "star-on"
    console.log(story[0]);
    currentUser.addFave(story[0])
  }
  else {
    e.target.className = "star-off"
    currentUser.removeFave(story[0])
  }
})

const container = document.querySelector('.stories-container.container');




