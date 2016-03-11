export default class RichState {
  constructor(store) {
    this.state = store.getState();
  }

  activeAccount() {
    if (this.activeAccountCache) return this.activeAccountCache;
    return this.activeAccountCache = this.state.accounts[this.state.activeAccountIndex];
  }

  activeTab() {
    if (this.activeTabCache) return this.activeTabCache;
    return this.activeTabCache = (this.state.selectedTabByUserId[this.activeAccount().id] || 'home');
  }

  nextTab() {
    return {
      home:     'mentions',
      mentions: 'lists',
      lists:    'search',
      search:   'search',
    }[this.activeTab()];
  }

  selectedTweetId() {
    if (this.selectedTweetIdCache) return this.selectedTweetIdCache;
    return this.selectedTweetIdCache = (
      this.state.selectedTweetIdsByUserId[this.activeAccount().id] &&
      this.state.selectedTweetIdsByUserId[this.activeAccount().id][this.activeTab()]
    );
  }

  activeTabTweets() {
    if (this.activeTabTweetsCache) return this.activeTabTweetsCache;
    return this.activeTabTweetsCache = (
      this.state.tabsByUserId[this.activeAccount().id] &&
      this.state.tabsByUserId[this.activeAccount().id][this.activeTab()]
    );
  }

  activeTweet() {
    if (this.activeTweetCache) return this.activeTweetCache;
    return this.activeTweetCache = this.findTweet(
      this.activeTabTweets(),
      this.selectedTweetId(),
    );
  }

  findNextTweet() {
    let activeIndex = this.findTweetIndex(this.activeTabTweets(), this.selectedTweetId());
    if (activeIndex == null) return null;
    return this.activeTabTweets().slice(activeIndex).slice(1)[0];
  }

  findPrevTweet() {
    let activeIndex = this.findTweetIndex(this.activeTabTweets(), this.selectedTweetId());
    if (activeIndex == null || activeIndex == 0) return null;
    return this.activeTabTweets()[activeIndex-1];
  }

  findFirstTweet() {
    return this.activeTabTweets()[0];
  }

  findTweet(tweets, id_str) {
    let index = this.findTweetIndex(tweets, id_str);
    if (index == null) return null;
    return tweets[index];
  }

  findTweetIndex(tweets, id_str) {
    if (!tweets || !id_str) return null;
    for (let i in tweets) {
      if (tweets[i].id_str === id_str) return i;
    }
    return null;
  }
}
