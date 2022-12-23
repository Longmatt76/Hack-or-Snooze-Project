"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.slideDown("slow");
  $signupForm.slideDown("slow");
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  hidePageComponents();
  putStoriesOnPage();
  $("#nav-submit").show();
  $("#nav-favorites").show();
  $("#nav-my-stories").show();
}

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $submitForm.slideDown("slow");
}

$navSubmit.on("click", navSubmitClick);

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  $faveStories.slideDown("slow");
  $faveStories.css("display", "inline-block");
}

$navFavorites.on("click", navFavoritesClick);

function navProfileClick() {
  console.debug("navProfileClick");
  hidePageComponents();
  $("#profile-name").text(currentUser.name);
  $("#profile-username").text(currentUser.username);
  $("#profile-account-date").text(currentUser.createdAt.slice(0, 10));
  $userProfile.slideDown("slow");
}

$navUserProfile.on("click", navProfileClick);

function navMyStories() {
  console.debug("navMyStories");
  hidePageComponents();
  putUserStoriesOnPage();
  $myStories.slideDown("slow");
}

$navMyStories.on("click", navMyStories);
