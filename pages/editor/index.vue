<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                  :disabled="disabled"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                  :disabled="disabled"
                >
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
                  :disabled="disabled"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="tagString"
                  :disabled="disabled"
                ><div class="tag-list"></div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                :disabled="disabled"
                @click="submitArticle"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getArticle, addArticle, updateArticle } from '@/api/article';

export default {
  name: 'EditorIndex',
  middleware: 'authenticated',
  data () {
    return {
      tagString: '',
      slug: null,
      disabled: false,
      article: {
        title: '',
        description: '',
        body: '',
        tagList: [], // 以英文半角分号 ; 分割成数组上传后端
      }
    };
  },
  methods: {
    async submitArticle () {
      let newSlug = '';
      this.article.tagList = this.tagString.split(';');
      this.disabled = true;
      if (this.slug) {
        const { data } = await updateArticle({
          slug: this.slug,
          data: { article: this.article },
        });
        newSlug = data.article.slug;
      } else {
        const { data } = await addArticle({ article: this.article });
        newSlug = data.article.slug;
      }
      this.disabled = false;
      this.$router.push(`/article/${newSlug}`);
    }
  },
  async mounted () {
    const { slug } = this.$route.params;
    if (slug) {
      this.slug = slug;
      const { data } = await getArticle(slug);
      this.article = data.article;
      this.tagString = data.article.tagList.join(';');
    }
  }
}
</script>

<style>

</style>