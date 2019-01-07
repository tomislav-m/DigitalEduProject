using DigObr.Models;
using System.Web.Http;

namespace DigObr.Controllers
{
    public class ValuesController : ApiController
    {

        // GET api/values
        public string Get()
        {
            return "value";
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public string Post([FromBody]string input)
        {
            Query query = new Query(input);
            return query.Answer;
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
