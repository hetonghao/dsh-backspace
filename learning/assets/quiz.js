/* 可复用的测验组件：检索练习 + 即时反馈。
 *
 * 用法（不需要构建步骤，直接 <script src="../assets/quiz.js" defer>）：
 *
 *   <div class="quiz" data-answer="B">
 *     <p class="quiz-q"><span class="idx">1</span>题干文字</p>
 *     <div class="quiz-opts">
 *       <button class="quiz-opt" data-key="A">选项一</button>
 *       <button class="quiz-opt" data-key="B">选项二</button>
 *       <button class="quiz-opt" data-key="C">选项三</button>
 *     </div>
 *     <p class="quiz-feedback"
 *        data-correct="为什么 B 对……"
 *        data-wrong="再想想：……"></p>
 *     <button class="quiz-reset" type="button">重做</button>
 *   </div>
 *
 * 约定：所有选项字数、字符数尽量一致，避免格式泄漏答案。
 */
(() => {
  'use strict'

  const init = (root) => {
    if (root.dataset.quizReady === '1') return
    root.dataset.quizReady = '1'

    const answer = root.dataset.answer
    const options = [...root.querySelectorAll('.quiz-opt')]
    const feedback = root.querySelector('.quiz-feedback')
    const reset = root.querySelector('.quiz-reset')
    if (!answer || options.length === 0 || !feedback) return

    const settle = (chosen) => {
      const correct = chosen.dataset.key === answer
      for (const option of options) {
        option.disabled = true
        if (option === chosen) option.dataset.state = correct ? 'correct' : 'wrong'
        else if (option.dataset.key === answer) option.dataset.state = 'correct'
        else option.dataset.state = 'muted'
      }
      feedback.classList.toggle('is-correct', correct)
      feedback.classList.toggle('is-wrong', !correct)
      const message = correct ? root.dataset.feedbackCorrect : root.dataset.feedbackWrong
      feedback.innerHTML = `<strong>${correct ? '答对了。' : '再想一步。'}</strong> ${message ?? ''}`
    }

    for (const option of options) {
      option.addEventListener('click', () => settle(option))
    }

    reset?.addEventListener('click', () => {
      for (const option of options) {
        option.disabled = false
        delete option.dataset.state
      }
      feedback.classList.remove('is-correct', 'is-wrong')
      feedback.textContent = ''
      options[0]?.focus()
    })
  }

  const boot = () => {
    for (const root of document.querySelectorAll('.quiz')) init(root)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true })
  } else {
    boot()
  }
})()
