<script setup lang="ts">
import { Comment } from '../../types';
import CommentCard from './CommentCard.vue'

defineProps<{
  comments: Comment[]
}>()
</script>

<template>
  <section>
    <h4>Avaliações</h4>
    <hr>
    <template v-if="comments.length > 0">
      <CommentCard v-for="comment in comments" :key="comment.id" :description="comment.description"
        :rating="comment.rating"></CommentCard>
    </template>
    <template v-else>
      Nenhum comentário feito até o momento
    </template>
  </section>
</template>