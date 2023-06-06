const mongoose = require('mongoose');
const marked = require('marked');     // it allow us too write makdown and turn it into html
const createDOMPurify = require('dompurify');
const {JSDOM} = require('jsdom');
const dompurify = createDOMPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
    title :{
        type: String,
        required: true
    },

    description:{
        type: String
    },

    markdown:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now       //if someone forgot to put createdAt  so this default  function will run
    },

    sanitizedHtml:{
        type: String,
        required: true
    }
});
articleSchema.pre('validate',function(next){
    if(this.markdown){
        this.sanitizedHtml =  dompurify.sanitize(marked.parse(this.markdown));
    }
    next();
});

module.exports = mongoose.model('Article',articleSchema);    //exporting this schema