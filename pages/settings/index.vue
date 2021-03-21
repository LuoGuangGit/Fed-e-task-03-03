<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form>
            <fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    v-model="user.image"
                    :disabled="updateDisabled"
                  >
                </fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    v-model="user.username"
                    :disabled="updateDisabled"
                  >
                </fieldset>
                <fieldset class="form-group">
                  <textarea
                    class="form-control form-control-lg"
                    rows="8"
                    placeholder="Short bio about you"
                    v-model="user.bio"
                    :disabled="updateDisabled"
                  ></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    v-model="user.email"
                    :disabled="updateDisabled"
                  >
                </fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    required
                    v-model="user.password"
                    :disabled="updateDisabled"
                  >
                </fieldset>
                <button
                  class="btn btn-lg btn-primary pull-xs-right"
                  :disabled="updateDisabled"
                  @click.prevent="updateSubmit"
                >
                  Update Settings
                </button>
            </fieldset>
          </form>
          <hr/>
          <button
            class="btn btn-outline-danger"
            :disabled="updateDisabled"
            @click="logout"
          >
            Or click here to logout.
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { updateUser, getUser } from '@/api/user';
const Cookie = process.client ? require('js-cookie') : undefined;

export default {
  name: 'SettingsIndex',
  middleware: 'authenticated',
  data () {
    return {
      updateDisabled: false,
      user: {
        bio: '',
        email: '',
        image: '',
        username: '',
        password: '',
      }
    };
  },
  async mounted () {
    const { data } = await getUser();
    this.user = {
      ...data.user,
      ...this.storeUser,
    };
  },
  methods: {
    ...mapMutations(['setUser']),
    logout () {
      Cookie.set('user', null);
      this.setUser(null);
      this.$router.push('/');
    },
    async updateSubmit () {
      const user = { ...this.user };
      this.updateDisabled = true;
      if (this.user.password === '') delete user.password;
      const { data } = await updateUser({ user });
      const { user: userData } = data;
      this.setUser(userData);
      Cookie.set('user', userData);
      this.updateDisabled = false;
      this.$router.push(`/profile/${userData.username}`);
    },
  }
}
</script>

<style>

</style>