'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author';


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

  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* for each article */

  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';

  for(let article of articles){

    /* get the article id */

    const articleId = article.getAttribute('id');
    console.log('articleId:', articleId);

    /* find the title element */

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

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
}

generateTitleLinks();

function generateTags(){

  /* find all articles */

  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */

  for(let article of articles){

    /* find tags wrapper */

    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    tagsWrapper.innerHTML = '';

    /* make html variable with empty string */

    let html = '';

    /* get tags from data-tags attribute */

    const articleTags = article.getAttribute('data-tags');
    console.log(articleTags);

    /* split tags into array */

    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);

    /* START LOOP: for each tag */

    for(let tag of articleTagsArray){
      console.log(tag);

      /* generate HTML of the link */

      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      console.log(linkHTML);

      /* add generated code to html variable */

      html = html + linkHTML;

    /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */

    /* END LOOP: for every article: */
    tagsWrapper.innerHTML = html;
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

  /* find all authors */

  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */

  for(let article of articles){

    /* find author wrapper */

    const authorWrapper = article.querySelector(optArticleAuthorSelector);

    /* make html variable with empty string */

    let html = '';

    /* get author from data-author attribute */

    const articleAuthor = article.getAttribute('data-author');
    console.log('articleAuthor:', articleAuthor);

    /* generate HTML of the link */

    const linkHTML = '<a href="#author-' + articleAuthor + '">by ' + articleAuthor + '</a>';
    console.log('author link:', linkHTML);

    /* add generated code to html variable */

    html = html + linkHTML;
    console.log(html);

    /* END LOOP: for every article */

    authorWrapper.innerHTML = html;
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

const links = document.querySelectorAll('.titles a');

for(let link of links){
  link.addEventListener('click', titleClickHandler);
}
