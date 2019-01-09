using Google.Cloud.Dialogflow.V2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace DigObr.Controllers
{
    public class DialogflowController : ApiController
    {
        private static SessionsClient sessionsClient;
        private static SessionName session;
        private Db db = new Db();

        public DialogflowController()
        {
            sessionsClient = SessionsClient.Create();
            session = new SessionName("digobr", "digobr123");
        }

        // GET: api/Dialogflow
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Dialogflow/5
        [ActionName("Ask")]
        public async Task<string> Get(int subjectId, string question)
        {
            var intent = new QueryResult();
            var subject = await db.Subjects.FindAsync(subjectId);
            intent = await Ask(subject.Name);
            intent = await Ask(question);
            if(intent.Intent.IsFallback)
            {
                return "There is no answer to given question. Please change your question or send it to staff.";
            }
            return intent.FulfillmentText;
        }

        // POST: api/Dialogflow
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Dialogflow/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Dialogflow/5
        public void Delete(int id)
        {
        }

        private static async Task<QueryResult> Ask(string query, IntentView intentView = IntentView.Unspecified)
        {
            QueryInput queryInput = new QueryInput();
            var textInput = new TextInput
            {
                Text = query,
                LanguageCode = "en"
            };
            queryInput.Text = textInput;
            var request = new DetectIntentRequest
            {
                Session = session.ToString(),
                QueryInput = queryInput
            };
            var response = (await sessionsClient.DetectIntentAsync(request)).QueryResult;
            //var intent = intentView == IntentView.Full ? GetFullIntent(response.Intent.IntentName) : response.Intent;
            return response;
        }

        private static Intent GetFullIntent(IntentName intentName)
        {
            IntentsClient intentsClient = IntentsClient.Create();
            ProjectAgentName parent = new ProjectAgentName("digobr");
            var request = new GetIntentRequest
            {
                IntentName = intentName,
                IntentView = IntentView.Full
            };
            var fullIntent = intentsClient.GetIntent(request);
            return fullIntent;
        }
    }
}
