import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  const { postArticle, currentArticle, setCurrentArticleId, updateArticle } = props;
  const [values, setValues] = useState(initialFormValues)

  const reset = () => {
    setValues(initialFormValues);
    setCurrentArticleId(null)
  }

  useEffect(() => {
    currentArticle ?
    setValues(currentArticle) : 
    reset()
  },[currentArticle])

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = evt => {
    evt.preventDefault()
  
    if ( currentArticle ){
    const updatedObj = {
      article_id: currentArticle.article_id,
      article: {
        title: values.title,
        text: values.text,
        topic: values.topic,
      }
    }
      updateArticle(updatedObj);
      reset()
    }
    else if ( !currentArticle ) {
      postArticle(values);
      reset()
    }
    else {
      reset();
    }
    reset();
  }

  const isDisabled = () => {
    if ((values.title !== '' && values.text !== '' && values.topic !== '' ) || currentArticle ) {
      return false
    }
    else {
      return true
    }
  }

  return (
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? `Edit Article` : `Create Article`}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle" onClick={() => onSubmit}>Submit</button>
        <button id='cancelEdit' disabled={isDisabled()} onClick={() => reset()}>Cancel edit</button>
      </div>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
