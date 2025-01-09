export function formatAIResponse(content){
    if(!content)return '';

    let formatted = content.replace(/\n{3,}/g, '\n\n');

    //bullet points
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    //numbers
    formatted = formatted.replace(/(\d{1,3}(,\d{3})*(\.\d+)?)/g, '<span class="number">$1</span>');

    //split by new lines and wrap by parapgraph
    const paragraphs = formatted.split('\n').map(para => 
        para.trim() ? 
            (para.includes('class="bullet-point"') || para.includes('class="section-heading"')) ? 
                para : `<p>${para}</p>` 
            : '<br/>'
    ).join('');


    // Handle sections/headings
    formatted = formatted.replace(/(.*?:)\n/g, '<div class="section-heading">$1</div>');

    return paragraphs;
  }