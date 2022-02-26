'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
};

const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  activeLinkSelector: '.titles a.active',
  activeArticleSelector: '.posts .active',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: '.tags.list',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size-',
  authorsListSelector: '.list.authors',
};

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const activeLinks = document.querySelectorAll(opts.activeLinkSelector);
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  clickedElement.classList.add('active');
  const activeArticles = document.querySelectorAll(opts.activeArticleSelector);
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  const articleSelector = clickedElement.getAttribute('href');
  const targetArticle = document.querySelector(articleSelector);
  targetArticle.classList.add('active');
}

function generateTitleLinks(customSelector = ''){
  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';
  const articles = document.querySelectorAll(opts.articleSelector + customSelector);
  let html = '';
  for(let article of articles){
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
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
  const minLimit = 999999;
  const params = {max: 0, min: minLimit};
  for(let tag in tags){
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
  let allTags = {};
  const articles = document.querySelectorAll(opts.articleSelector);
  for(let article of articles){
    const tagsWrapper = article.querySelector(opts.articleTagsSelector);
    tagsWrapper.innerHTML = '';
    let html = '';
    const articleTags = article.getAttribute('data-tags');
    const articleTagsArray = articleTags.split(' ');
    for(let tag of articleTagsArray){
      const linkHTMLData = {tag: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      html = html + linkHTML;
      !allTags[tag] ? allTags[tag] = 1 : allTags[tag]++;
    }
    tagsWrapper.innerHTML = html;
    const tagList = document.querySelector('.tags');
    const tagsParams = calculateTagsParams(allTags);
    const allTagsData = {tags: []};
    for(let tag in allTags){
      allTagsData.tags.push({
        tag: tag,
        //count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams),
      });
    }
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
  }
}

generateTags();

function tagClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  for(let tagLink of tagLinks){
    tagLink.classList.remove('active');
  }
  const equalLinks = document.querySelectorAll('a[href="' + href + '"]');
  for(let equalLink of equalLinks){
    equalLink.classList.add('active');
  }
  generateTitleLinks('[data-tags~="' + tag +'"]');
}

function addClickListenersToTags(){
  const tagLinks = document.querySelectorAll('[href^="#tag-"]');
  for(let tagLink of tagLinks){
    tagLink.addEventListener('click', tagClickHandler);
  }
}

addClickListenersToTags();

function calculateAuthorsParams(authors){
  const minLimit = 999999;
  const params = {max: 0, min: minLimit};
  for(let author in authors){
    params.max = Math.max(authors[author], params.max);
    params.min = Math.min(authors[author], params.min);
  }
  return params;
}

function generateAuthors(){
  let allAuthors = {};
  const articles = document.querySelectorAll(opts.articleSelector);
  for(let article of articles){
    const authorWrapper = article.querySelector(opts.articleAuthorSelector);
    let html = '';
    const articleAuthor = article.getAttribute('data-author');
    const linkHTMLData = {author: articleAuthor};
    const linkHTML = templates.authorLink(linkHTMLData);
    html = html + linkHTML;
    !allAuthors[articleAuthor] ? allAuthors[articleAuthor] = 1 : allAuthors[articleAuthor]++;
    authorWrapper.innerHTML = html;
  }
  const authorList = document.querySelector('.authors.list');
  const authorsParams = calculateAuthorsParams(allAuthors);
  const allAuthorsData = {authors: []};
  for(let author in allAuthors){
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
      className: calculateTagClass(allAuthors, authorsParams),
    });
  }
  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
}

generateAuthors();

function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  for(let authorLink of authorLinks){
    authorLink.classList.remove('active');
  }
  const equalLinks = document.querySelectorAll('a[href="' + href + '"]');
  for(let equalLink of equalLinks){
    equalLink.classList.add('active');
  }
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  const authorLinks = document.querySelectorAll('[href^="#author-"]');
  for(let authorLink of authorLinks){
    authorLink.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();
