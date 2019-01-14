using Google.Cloud.Dialogflow.V2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using static Google.Cloud.Dialogflow.V2.Intent.Types;
using static Google.Cloud.Dialogflow.V2.Intent.Types.Message.Types;

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

        // GET: api/Dialogflow/5
        [System.Web.Http.HttpGet]
        [ActionName("Check")]
        public async Task<float> CheckAnswer(int subjectId, string question, string answer)
        {
            var intent = new QueryResult();
            var subject = await db.Subjects.FindAsync(subjectId);
            intent = await Ask(subject.Name+" Questions");
            intent = await Ask(question);
            intent = await Ask(answer);
            if (intent.Intent.IsFallback)
            {
                return 0;
            }
            return intent.IntentDetectionConfidence;          
        }

        // GET: api/Dialogflow/5
        [System.Web.Http.HttpGet]
        [ActionName("Question")]
        public async Task<List<SubjectQuestion>> GetQuestion(int subjectId)
        {
            var num = await GetNumber(subjectId);
            var list = new List<SubjectQuestion>();
            for (int i = 1; i <= num; ++i)
            {
                string id = "Q" + i;
                var intent = new QueryResult();
                var subject = await db.Subjects.FindAsync(subjectId);
                intent = await Ask(subject.Name + " Questions");
                intent = await Ask(id);
                if (intent.Intent.IsFallback)
                {
                    continue;
                }
                list.Add(new SubjectQuestion { Id = id, Question = intent.FulfillmentText });
            }
            return list;
        }
        
        private async Task<int> GetNumber(int subjectId)
        {
            var intent = new QueryResult();
            var subject = await db.Subjects.FindAsync(subjectId);
            intent = await Ask(subject.Name + " Questions");
            if (intent.Intent.IsFallback)
            {
                return 0;
            }
            return Int32.Parse(intent.FulfillmentText);
        }

        // POST: api/Dialogflow
        [ActionName("Send")]
        public async Task<IHttpActionResult> Post([FromBody]Dialogflow dialogflow)
        {
            var subject = await db.Subjects.FindAsync(dialogflow.SubjectId);
            IntentsClient intentsClient = await IntentsClient.CreateAsync();
            var intentId = intentsClient.ListIntents(new ProjectAgentName("digobr")).SingleOrDefault(x => x.DisplayName == subject.Name).Name;
            //var parentIntent = await intentsClient.GetIntentAsync(new IntentName("digobr", subject.Name));
            
            var req = new CreateIntentRequest
            {
                ParentAsProjectAgentName = new ProjectAgentName("digobr"),
                Intent = CreateNewIntent(dialogflow.Question, dialogflow.Answer, subject.Name, intentId),
                LanguageCode = "en"
            };
            try
            {
                await intentsClient.CreateIntentAsync(req);
            }
            catch (Exception exc)
            {

            }
            return Ok();
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

        private static Intent CreateNewIntent(string question, string response, string subject, string indentId)
        {
            var text = new Text();
            text.Text_.Add(response);
            var message = new Message
            {
                Text = text
            };
            var phrase = new TrainingPhrase
            {
                Name = Guid.NewGuid().ToString()
            };
            var part = new TrainingPhrase.Types.Part { Text = question };
            phrase.Parts.Add(part);
            var intent = new Intent
            {
                ParentFollowupIntentName = indentId,
                DisplayName = subject + " - " + question.Substring(1, question.Length / 3)
            };
            intent.Messages.Add(message);
            intent.TrainingPhrases.Add(phrase);
            return intent;
        }

        public class Dialogflow
        {
            public int SubjectId { get; set; }
            public string Question { get; set; }
            public string Answer { get; set; }
        }

        public class SubjectQuestion
        {
            public string Id { get; set; }
            public string Question { get; set; }
        }
    }
}
