'use strict';

const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: '.tags.list',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size-',
  authorsListSelector: '.list.authors'
}

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');

  /* [DONE] remove class 'active' fromm all article links */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */

  console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts .active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');
  console.log('articleSelector:', articleSelector);

  /* [DONE] find correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);
  console.log('targetArticle:', targetArticle);

  /* add class 'active' to the correct article */

  targetArticle.classList.add('active');
}

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */

  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';

  /* for each article */

  const articles = document.querySelectorAll(opts.articleSelector + customSelector);

  let html = '';

  for(let article of articles){

    /* get the article id */

    const articleId = article.getAttribute('id');
    console.log('articleId:', articleId);

    /* find the title element */

    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

    /* get the title from title element */

    //const title = article.getAttribute('title');

    /* create HTML of the link */

    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    console.log(linkHTML);

    /* insert link into titleList */

    titleList.insertAdjacentHTML('beforeend', linkHTML);
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags){

  const params = {max: 0, min: 999999};

  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max){
      params.max = tags[tag];
    } else if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }

  return params;
}

function calculateTagClass(count, params){

  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opts.cloudClassCount - 1) + 1);

  return opts.cloudClassPrefix + classNumber;
}

function generateTags(){

  /* create new variable allTags with an empty object */

  let allTags = {};

  /* find all articles */

  const articles = document.querySelectorAll(opts.articleSelector);

  /* START LOOP: for every article: */

  for(let article of articles){

    /* find tags wrapper */

    const tagsWrapper = article.querySelector(opts.articleTagsSelector);
    tagsWrapper.innerHTML = '';

    /* make html variable with empty string */

    let html = '';

    /* get tags from data-tags attribute */

    const articleTags = article.getAttribute('data-tags');
    console.log('data-tags:', articleTags);

    /* split tags into array */

    const articleTagsArray = articleTags.split(' ');
    console.log('articleTagsArray:', articleTagsArray);

    /* START LOOP: for each tag */

    for(let tag of articleTagsArray){
      console.log('tag:', tag);

      /* generate HTML of the link */

      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      console.log('linkHTML:', linkHTML);

      /* add generated code to html variable */

      html = html + linkHTML;

      /* check if this link is NOT already in allTags */

      if(!allTags[tag]){

        /* add tag to allTags object */

        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

    /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */

    /* END LOOP: for every article: */

    tagsWrapper.innerHTML = html;

    /* find list of tags in right column */

    const tagList = document.querySelector('.tags');

    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams);

    /* create variable for all links HTML code */

    let allTagsHTML = '';

    /* START LOOP: for each tag in allTags: */

    for(let tag in allTags){

      /* generate code of a link and add it to allTagsHTML */

      const linkHTML = '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '</a></li>';
      allTagsHTML = allTagsHTML + linkHTML;
    }

    /* END LOOP: for each tag an allTags */

    /* add html from allTagsHTML to tagList */

    tagList.innerHTML = allTagsHTML;
  }
}

generateTags();

function tagClickHandler(event){
  /* prevent default action fot this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it value of "this" */
  const clickedElement = this;
  console.log('clicked tag', clickedElement);

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');
  console.log('clickedElements href:', href);

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */

  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each active tag link */

  for(let tagLink of tagLinks){

    /* remove class active */
    tagLink.classList.remove('active');

  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */

  const equalLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log(equalLinks);

  /* START LOOP: for each found tag link */

  for(let equalLink of equalLinks){

    /* add class active */

    equalLink.classList.add('active');

  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag +'"]');

}

function addClickListenersToTags(){

  /* find all links to tags */

  const tagLinks = document.querySelectorAll('[href^="#tag-"]');

  /* START LOOP: for each link */

  for(let tagLink of tagLinks){

    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors(){

  /* create a new variable allAuthors with an empty object */

  let allAuthors = {};
  console.log('allAuthors', allAuthors);

  /* find all authors */

  const articles = document.querySelectorAll(opts.articleSelector);

  /* START LOOP: for every article: */

  for(let article of articles){

    /* find author wrapper */

    const authorWrapper = article.querySelector(opts.articleAuthorSelector);
    authorWrapper.innerHTML = '';

    /* make html variable with empty string */

    let html = '';

    /* get author from data-author attribute */

    const articleAuthor = article.getAttribute('data-author');
    console.log('data-author:', articleAuthor);

    /* generate HTML of the link */

    const linkHTML = '<a href="#author-' + articleAuthor + '">by ' + articleAuthor + '</a>';
    console.log('author link:', linkHTML);

    /* add generated code to html variable */

    html = html + linkHTML;
    console.log('html:', html);

    /* check if this link is NOT already in allAuthors */

    if(!allAuthors[articleAuthor]){

      /* add generated code to allAuthors array */

      allAuthors[articleAuthor] = 1;

    } else {

      allAuthors[articleAuthor]++;
    }

    authorWrapper.innerHTML = html;

    const authorList = document.querySelectorAll(opts.authorsListSelector);

    let allAuthorsHTML = '';

    for(let author in allAuthors){

      allAuthorsHTML += '<li><a href="#author-' + author + '"><span>' + author + '</span>' + ' (' + allAuthors[author] + ')' +'</a></li>';
    }
    for(let author of authorList){
      author.innerHTML = allAuthorsHTML;
    }

  }
}

generateAuthors();

function authorClickHandler(){
  /* prevent default action fot this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it value of "this" */
  const clickedElement = this;
  console.log('clicked author', clickedElement);

  /* make new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');
  console.log('clickedElement href:', href);

  /* make new constant "author" and extract author from the "href" constant */

  const author = href.replace('#author-', '');

  /* find all author links with class active */

  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each active author link: */

  for(let authorLink of authorLinks){

    /* remove class active */

    authorLink.classList.remove('active');

    /* END LOOP: for each active author link */
  }

  /* find all author links with "href" attribute equal to the "href"  constant */

  const equalLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log(equalLinks);

  /* START LOOP: for each found author link: */

  for(let equalLink of equalLinks){

    /* add class active */

    equalLink.classList.add('active');

    /* END LOOP: for each found author link */
  }

  /* execute function "generateTitleLinks" with author selector as argument */

  generateTitleLinks('[data-author="' + author + '"]');

}

function addClickListenersToAuthors() {

  /* find all links to authors */

  const authorLinks = document.querySelectorAll('[href^="#author-"]');

  /* START LOOP: for each author: */

  for(let authorLink of authorLinks){

    /* add authorClickHandler as event listener for that link */

    authorLink.addEventListener('click', authorClickHandler);

  /* END LOOP: for each author */
  }
}

addClickListenersToAuthors();
