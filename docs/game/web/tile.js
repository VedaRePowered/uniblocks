class Tile{constructor(a,i,s,e){this.imageTag=new Image(16,16),this.imageTag.src=s,this.tileId=a,this.display={name:i},this.code=e}draw(a,i){canvasContext.drawImage(this.imageTag,a,i)}}
