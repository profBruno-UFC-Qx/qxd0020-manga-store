<script setup lang="ts">
import Comment from './CommentCard.vue'

defineProps<{ comments: {
    id: number,
    description: string,
    rating: number
  }[]
}>()
</script>

<template>
  <section>
      <h4>Avaliações</h4>
      <hr>
      <template v-if="comments.length > 0">
          <Comment v-for="comment in comments" :key="comment.id"
            :description="comment.description"
            :rating="comment.rating"
          ></Comment>
      </template>
      <template v-else>
          Nenhum comentário feito até o momento
      </template>   
    </section> 
</template>