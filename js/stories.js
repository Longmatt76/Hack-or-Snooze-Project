"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  if (!loggedInStatus) {
    $("i").hide();
  }
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}"> ${
    showDeleteBtn ? makeDeleteBtnHTML() : ""
  } <span><i class="far fa-star" id ="star" ></i></span> 
        <a href="${story.url}" target="a_blank" class="story-link">
       ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function makeDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
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
  $faveStories.slideUp("slow");

  if (loggedInStatus) {
    $("i").show();
  } else if (!loggedInStatus) {
    $("i").hide();
  }
}

async function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");
  $myStories.empty();

  if (currentUser.ownStories.length === 0) {
    $myStories.append("<h3>No stories added by user yet!</h3>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $myStories.append($story);
    }
  }

  $myStories.slideDown("slow");
}

async function deleteUserStories(evt) {
  console.debug("deleteUserStories");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  await putUserStoriesOnPage();
}

$myStories.on("click", ".trash-can", deleteUserStories);

async function getStoryData(evt) {
  console.debug("getStoryData");
  evt.preventDefault();

  const title = $("#story-add-title").val();
  const author = $("#story-add-author").val();
  const url = $("#story-add-url").val();
  const username = currentUser.username;
  const data = { title, author, url, username };

  const storyToAdd = await storyList.addStory(currentUser, data);
  const $storyToAdd = generateStoryMarkup(storyToAdd);
  $allStoriesList.prepend($storyToAdd);

  $submitForm.trigger("reset");
  hidePageComponents();
  $allStoriesList.slideDown("slow");
}

$submitForm.on("submit", getStoryData);

async function fillFaves(evt) {
  console.debug("fillFaves");
  const $target = $(evt.target);
  const targetList = evt.target.closest("li");
  const storyId = targetList.id;
  const targetListClone = targetList.cloneNode(true);
  const story = storyList.stories.find((s) => s.storyId === storyId);
  console.log($target);
  $faveStories.append(targetListClone);
  if ($target.hasClass("far")) {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }

  $("#faveH3").hide();
}

$allStoriesList.on("click", "#star", fillFaves);
