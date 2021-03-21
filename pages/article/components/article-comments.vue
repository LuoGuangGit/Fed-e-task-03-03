<template>
  <div>
    <form class="card comment-form" v-if="user">
      <div class="card-block">
        <textarea class="form-control" placeholder="Write a comment..." rows="3" v-model="comment.body"></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button
          class="btn btn-sm btn-primary"
          :disabled="commentDisabled"
          @click.prevent="toComment"
        >Post Comment</button>
      </div>
    </form>
    
    <div 
      class="card"
      v-for="(comment, index) in comments"
      :key="comment.id"
    >
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }"
        >{{ comment.author.username }}</nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
        <span
          class="mod-options"
          v-if="user && user.username === comment.author.username"
        >
          <i
            class="ion-trash-a"
            :class="{ disabled: comment.deleteDisabled }"
            @click="delComment(comment, index)"
          />
        </span>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getComments, addComment, deleteComment } from '@/api/article';

export default {
  name: 'ArticleComments',
  data () {
    return {
      comments: [],
      commentDisabled: false,
      comment: {
        body: ''
      },
    };
  },
  props: {
    article: {
      type: Object,
      required: true,
    }
  },
  async mounted () {
    const { data } = await getComments(this.article.slug);
    const { comments } = data;
    comments.forEach(item => item.deleteDisabled = false);
    this.comments = comments;
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    async toComment () {
      this.commentDisabled = true;
      const { data } = await addComment({
        slug: this.article.slug,
        data: this.comment,
      });
      this.comment.body = '';
      this.commentDisabled = false;
      this.comments.unshift(data.comment);
    },
    async delComment (comment, index) {
      comment.deleteDisabled = true;
      if (comment.deleteDisabled) {
        await deleteComment({
          slug: this.article.slug,
          id: comment.id,
        });
        this.comments.splice(index, 1);
      }
    },
  }
}
</script>

<style>
.disabled {
  cursor: not-allowed !important;
}
</style>