<template>
  <article class="tile is-child box">
    <div class="content">
      <div class="header__container">
        <div class="title">
          Interests
        </div>
        <div class="level-item dropDown__container">
          <div ref="dropDown__categories" :class="{'dropdown': true,  'is-right':true, 'is-active': displayDropdown }">
            <div class="dropdown-trigger">
              <span>
                <IconDots @click.native="handleDropDownClick" class='icon icon-medium' aria-haspopup="true" aria-controls="dropdown-menu__userBio" />
              </span>
            </div>
            <div class="dropdown-menu" id="dropdown-menu__userBio" role="menu">
              <div class="dropdown-content">
                <a @click="isEditMode = !isEditMode" class="dropdown-item">
                  <IconTags class="icon icon-small"/>
                  <span>Add or Remove tags</span>
                </a>
                <a class="dropdown-item">
                  <IconEye class="icon icon-small"/>
                  <span> View all tags</span>
                </a>

                <hr class="dropdown-divider">
                <a href="#" class="dropdown-item">
                  <IconDelete class="icon icon-small" /> 
                  Delete all tags
                </a>
              </div>
            </div>
          </div>
        </div>         
      </div>
      <div class="subtitle">
        Define your favorite categories
      </div>
    </div>
  
    <div class="content">
     <div  class="tags__container">
      <div v-if="!isEditMode" class="field mt-4">
         <span v-for="tag in userTags" class="m-1 tag"   :style="{ 'backgroundColor': tag.color }" >
           {{tag.label}}
         </span>
      </div>

      <div v-else class="field mt-4">
        <div>
          <label class="typo__label" for="ajax">Pick an existing category or add your own</label>
          <multiselect 
            v-model="selectedTags" 
            id="ajax" 
            label="label" 
            track-by="tagId" 
            placeholder="Type to search" 
            open-direction="bottom" 
            :options="suggestedTags"
            :taggable="true"
            tag-placeholder="Add this as new tag"
            :multiple="true" 
            :loading="isLoading"
            :select-label="'add to your tags'"
            :deselect-label="'add to your tags'"
            :internal-search="false"
            :clear-on-select="false" 
            :close-on-select="true" 
            :options-limit="300" 
            :show-no-results="false" 
            :hide-selected="true" 
            @tag="addTag" >
            <template slot="tag" slot-scope="{ option, remove }">
              <span
                :style="{ 'backgroundColor': option.color }" 
                class="custom__tag m-1 tag">
                <span>{{ option.label }}</span>
                <button  
                 @click="remove(option)" 
                 class="delete is-small">
                </button>
              </span>
            </template>
            <template slot="clear" slot-scope="props">
              <div class="multiselect__clear" 
                v-if="suggestedTags.length"
                @mousedown.prevent.stop="clearAll(props.search)">
              </div>
            </template> 
            <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
          </multiselect>

          <div class="control">
            <a @click="handleSaveCategories" class="button mt-2 is-small is-link is-rounded">
              <IconSave class='icon icon-white' />
              <small class="ml-1">Save</small>
            </a>
            <a class="button mt-2 ml-1 is-small is-danger is-rounded">
              <IconCancel class='icon icon-white' />
              <small class="ml-1">Cancel</small>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</article>
</template>
<script>
import { fireDb } from '~/plugins/firebase'
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex';

import Multiselect from 'vue-multiselect'
import { IconDots, IconDelete, IconTags, IconEye, IconCancel, IconSave } from '~/components/utils/icons'
export default{
  components: {
    IconDots,
    IconDelete,
    IconTags,
    IconEye,
    IconSave,
    IconCancel,
    Multiselect
  },
  props: {

  },

  data(){
    return {
      displayDropdown: false, 
      isEditMode: false,
      value: [],
      isLoading: false,
      selectedTags:[],
      suggestedTags:[],

    }
  },
  computed: {
    ...mapGetters(['currentUserProfile']),
    userTags(){
      return this.currentUserProfile.tags
    }
  },
  methods: {
    ...mapActions(['updateUserTags']),
    handleDropDownClick() {
      this.displayDropdown = !this.displayDropdown;
    },

    handleSaveCategories(){
      const sorted = _.partition(this.selectedTags, (t) => t.tagId);
			const existingTags = sorted[0];
      const newTags = sorted[1];
      this.updateUserTags({newTags, existingTags})
      this.isEditMode = false
    },

    asyncFind (query) {
      this.isLoading = true
      fireDb.collection('tags').get()
      .then(snapshot => {
        if(!snapshot.empty){
          const docs = snapshot.docs.map(doc => doc.data())
          this.suggestedTags = docs

        }
        this.isLoading = false
      })
    },

    addTag(newTagLabel){
      const tag = {label: newTagLabel.toLowerCase(), color: this.pickRandomColor()}
      this.selectedTags.push(tag)
      this.suggestedTags.push(tag)
    },

    pickRandomColor(){
      const colors = ['#1ac62c', '#e947a3', '#c6843c', '#befddd', '#d5a051', '#09f705', '#a6d65d', '#57e410', '#b024f6', '#20ad11']
      const randomIndex = Math.floor(Math.random() * colors.length)
      return colors[randomIndex]
    },

    close(e) {
      e.stopPropagation();

      if (this.$refs.dropDown__categories !== undefined) {
        if (!this.$refs.dropDown__categories.contains(e.target)) {
          this.displayDropdown = false;
        }
      }
    },
  },
  mounted(){
    window.addEventListener("click", this.close);
    this.asyncFind()
   

  },
  watch: {
    userTags: {
      immediate: true,
      handler(newVal){
        if(newVal && newVal.length){
          this.selectedTags = newVal
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>

.header__container{
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .title {
    flex-grow: 1;
  }
}



.dropDown__container {
  .dropdown-item {
    transition: background-color 0.5s ease;
    display: flex;
    align-items: center;
    .icon {
      margin-right: 5px;
    }
  }
  .dropdown-item:hover {
    text-decoration: none;
    background-color: #229bee;
    color: white;
    .icon {
      fill: white;
    }
  }
}

.multiselect__option--highlight {
  background: red !important;
  outline: none;
  color: white;
}
.multiselect__option--highlight:after {
  content: attr(data-select);
  background: #41B883;
  color: white;
}
.multiselect__option--selected {
  background: #F3F3F3;
  color: #35495E;
  font-weight: bold;
}
.multiselect__option--selected:after {
  content: attr(data-selected);
  color: silver;
}
.multiselect__option--selected.multiselect__option--highlight {
  background: #FF6A6A;
  color: #fff;
}
.multiselect__option--selected.multiselect__option--highlight:after {
  background: #FF6A6A;
  content: attr(data-deselect);
  color: #fff;
}

.content{
  .label{
    box-shadow: none;
    font-weight: 600;
  }
}

</style>
