# 0.0.1
* Initialize project
* Set up build with Eliot
* Create the Pipeline

```javascript
import { Pipeline } from 'ellie'

const pipeline = new Pipeline([
  SomeMiddleware,
  SomeOtherPipeline,
  AThirdPipeline
])

const response = await pipeline.pipe("Request")

console.log(response) // "Response"
```