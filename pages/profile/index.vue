<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img
              class="user-img"
              :src="profile.image"
            />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>
            <nuxt-link
              class="btn btn-sm btn-outline-secondary action-btn"
              to="/settings"
              v-if="user && user.username === profile.username"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
            <button
              class="btn btn-sm btn-outline-secondary action-btn"
              :class="{ active: profile.following }"
              :disabled="profile.followDisabled"
              v-else
              @click="onFollow"
            >
              <i class="ion-plus-round"></i>
              &nbsp;
              {{ profile.following ? 'Unfollow' : 'Follow' }} {{ profile.username }}
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'user_article' }"
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'user_article'
                    },
                  }"
                >{{ user && user.username === profile.username ? 'My' : 'User' }} Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'favorited_article' }"
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'favorited_article'
                    },
                  }"
                >Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>

          <!-- <div
            class="article-preview"
          >
            Loading articles...
          </div> -->

          <div
            class="article-preview"
            v-for="(article, index) in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link :to="{
                name: 'profile',
                params: {
                  username: article.author.username
                },
              }">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link class="author" :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  },
                }">{{ article.author.username }}</nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: article.favorited }"
                :disabled="article.favoriteDisabled"
                @click="onFavorite(article, index)"
                v-if="tab !== 'user_article' || (user && user.username !== profile.username)"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                v-for="item in totalPage"
                :key="item"
                :class="{ active: item === page }"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'profile',
                    query: {
                      page: item,
                      tab: tab
                    }
                  }"
                >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getProfile } from '@/api/profile';
import { addFollow, deleteFollow } from '@/api/user';
import { getArticles, getFeedArticles, addFavorite, deleteFavorite } from '@/api/article';

export default {
  name: 'UserProfile',
  middleware: 'authenticated',
  watchQuery: ['page', 'tab'],
  data () {
    return {
      tabLoading: true,
    };
  },
  async asyncData ({ query, params }) {
    const page = Number.parseInt(query.page || 1);
    const tab = query.tab || 'user_article';
    const limit = 20;
    const offset = (page - 1) * limit;
    const { username } = params;
    // const getArticlesList = tab === 'user_article' ? getArticles:  getFeedArticles;
    const sendParams = tab === 'user_article' ? { author: username } : { favorited: username };
    const [ articleRes, profileRes ] = await Promise.all([
      getArticles({
        ...sendParams,
        limit,
        offset,
      }),
      getProfile(username),
    ]);
    const { articles, articlesCount } = articleRes.data;
    const { profile } = profileRes.data;

    articles.forEach(article => article.favoriteDisabled = false);
    profile.followDisabled = false;

    return {
      tab,
      page,
      limit,
      articles,
      articlesCount,
      profile,
    };
  },
  computed: {
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  methods: {
    onChange () {},
    async onFavorite (article, index) {
      article.favoriteDisabled = true;
      if (!this.user) {
        this.$router.push('/login');
        return false;
      }
      if (article.favorited) {
        await deleteFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount += -1;
        this.articles.splice(index, 1);
      } else {
        /**
         * ? 如果用户不能点赞自己发布的文章那么这里的添加点赞可以移除
         */
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.favoriteDisabled = false;
    },
    async onFollow () {
      this.profile.followDisabled = true;
      if (!this.user) {
        this.$router.push('/login');
        return false;
      }
      if (this.profile.following) {
        await deleteFollow(this.profile.username);
        this.profile.following = false;
      } else {
        await addFollow(this.profile.username);
        this.profile.following = true;
      }
      this.profile.followDisabled = false;
    },
  },
}
</script>

<style>

</style>