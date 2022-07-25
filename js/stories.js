"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */
const formSubmit = $('#form')


async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage()
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
  const star = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
        ${star ? isStarOnLoad(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function isStarOnLoad(story, user) {
  const fave = user.isFavorite(story);
  const star = fave ? "star-on" : "star-off";
  return `<span class="star"> 
            <i class="${star}"></i>
          </span>`
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
  await StoryList.addStory(currentUser, {title: title.value, author: auth.value, url: `https://${url.value}`});
  getAndShowStoriesOnStart();
  setTimeout(appendToMyStories, 2000)
}

function appendToMyStories() {
  const li = $('#all-stories-list')[0].children[0];
  const myStory = $(`<li id=${li.id}><span class="trashcan"><i class="trashcan trash-logo"></i></span>${li.innerHTML}</li>`)
  $('#my-stories').append(myStory);
}



$(document).ready(function(e) {
  $('html').css('display', 'none')
  setTimeout(getInfo, 1000);
  
})

function appendToSections(section) {
  const $copyLi = $(`<li id="${section.id}">${section.innerHTML}</li>`)
  const $favorites = $('#favorite-stories')
  $favorites[0].append($copyLi[0])
}

function getInfo() { 
  const lis = document.children[0].children[1].children[1].children[1].children
  // const stories = $('#my-stories');
  // const allStories = $('#all-stories-list i')
  if (currentUser) {
  for (let li of lis) {
    const id = li.id;
      const stories = currentUser.favorites;
    for (let story of stories) {
      const storyId = story.storyId;
      if (storyId == id) {
        li.children[0].children[0].className = "star-on";
      }
    }
  for (let i = 0; i < lis.length; i++) {
    if (lis[i].children[0].children[0].className == "star-on") {
      appendToSections(lis[i])
    }
  }
  for (let i = 0; i < storyList.stories.length; i++) {
    const storyPoster = currentUser.username;
    if (lis[i].children[4].innerText == `posted by ${storyPoster}`) {
      let myStory = $(`<li id="${lis[i].id}"><span class="trashcan"><i class="trashcan trash-logo"></i></span>${lis[i].innerHTML}</li>`)
      $('#my-stories').append(myStory);
    }
  }

    }
  }
  $('html').css('display', 'block')
  hackOrSnooze()
  favorites()
  myStoriesList()
}

function hackOrSnooze() {
  const storyLis = $('#all-stories-list')
  storyLis.on('click', 'i', function(e) {
    const favs = $('#favorite-stories')[0]
    const storyLi = e.target.closest('li');
    const story = storyList.stories.filter(value => {
      return value.storyId == storyLi.id
    })
    if (e.target.className == "star-off") {
      const add = document.createElement('li');
      add.id = storyLi.id;
      e.target.className = "star-on"
      add.innerHTML = storyLi.innerHTML;
      currentUser.addFave(story[0])
      favs.append(add);
      for (let story of myStories.children()) {
        if (story.id == storyLi.id) {
          story.children[1].children[0].className = 'star-on';
        }

      }

    }
    else {
      const myStories = $('#my-stories')
      e.target.className = "star-off"
      currentUser.removeFave(story[0])
      for (let i = 0; i < favs.children.length; i++) {
        if (favs.children[i].id == storyLi.id) {
          favs.children[i].remove()
        }
      }
      for (let story of myStories.children()) {
        if (story.id == storyLi.id) {
          story.children[1].children[0].className = 'star-off';
        }
       

      }
    }
  })
}

function favorites() {
  const storyLis = $('#favorite-stories')
  storyLis.on('click', 'i', function(e) {
    const home = $('#all-stories-list').children();
    const myStories = $('#my-stories').children();
    const storyLi = e.target.closest('li');
    const story = storyList.stories.filter(value => {
      return value.storyId == storyLi.id
    })
    for (let li of home) {
      if (li.id == storyLi.id) {
        e.target.className = 'star-off'
        storyLi.remove()
        currentUser.removeFave(story[0]);
        li.children[0].children[0].className = "star-off"   
      }
    }
    for (let li of myStories) {
      if (li.id == storyLi.id) {
        li.children[1].children[0].className = "star-off"
      }
    }
  })
}

function myStoriesList() {
  const storyLis = $('#my-stories')
  const allStories = $('#all-stories-list').children()
  const favorites = $('#favorite-stories').children()
  storyLis.on('click', 'i', function(e) {
    const storyLi = e.target.closest('li');
    const story = storyList.stories.filter(value => {
      return value.storyId == storyLi.id
    })
    if (e.target.className == 'trashcan trash-logo') {
      currentUser.removeStory(story[0])
      storyLi.remove()
      for (let li of allStories) {
        if (li.id == storyLi.id) {
          li.remove();
        }
      }
    }
    if (e.target.className == 'star-on') {
      e.target.className = 'star-off'
      currentUser.removeFave(story[0])
      for (let li of allStories) {
        if (li.id == storyLi.id) {
          li.children[0].children[0].className = "star-off";
        }
      }
      for (let li of $('#favorite-stories').children()) {
        if (li.id == storyLi.id) {
          li.remove();
        }

      }
    }
    else {
      e.target.className = 'star-on';
      currentUser.addFave(story[0])
      const favStory = document.createElement('li');
      favStory.id = storyLi.id; 
      favStory.innerHTML = storyLi.innerHTML
      favStory.children[0].remove();
      $('#favorite-stories').append(favStory)
      for (let li of allStories) {
        if (li.id == storyLi.id) {
          li.children[0].children[0].className = "star-on";
        }
      }
      

    }

  })

}


// const container = document.querySelector('.stories-container.container');




