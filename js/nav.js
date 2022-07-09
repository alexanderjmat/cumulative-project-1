"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  $('#all-stories-list').css('display', 'block');
  $('#favorite-stories').css('display', 'none');
  $('#my-stories').css('display', 'none');
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}



const myStories = $('#my-stories')
const allStories = $('#all-stories-list')
const myFavorites = $('#favorite-stories')

const myStoriesNav = $('.stories')
const myFavoritesNav = $('.favorites')


myFavoritesNav.on('click', function() {
  allStories.css('display', 'none')
  myStories.css('display', 'none');
  $('#form').css('display', 'none')
  myFavorites.css('display', 'block');

})

myStoriesNav.on('click', function() {
  allStories.css('display', 'none')
  myFavorites.css('display', 'none');
  $('#form').css('display', 'none')
  myStories.css('display', 'block');
  

})

const submit = $('.submit')
submit.on('click', function() {
  myStories.css('display', 'none');
  myFavorites.css('display', 'none');
  allStories.css('display', 'block')
  if ($('#form').css('display') == 'none') {
    return $('#form').css('display', 'flex');
  }
  return $('#form').css('display', 'none');
 
})