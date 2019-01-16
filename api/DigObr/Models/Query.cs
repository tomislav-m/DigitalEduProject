using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Text;
using System.Web;

namespace DigObr.Models
{
    public class Query
    {
        public string Question { get; set; }
        public string Answer { get; set; }
        public string Intent { get; set; }

        private readonly string uri = "https://api.dialogflow.com/v1/query?v=20150910";
        private readonly string lang = "en";
        private readonly string token = "4102e554f7b94ad6b347722aba0ab1c6";
        private static readonly HttpClient client = new HttpClient();

        public Query(string query)
        {
            Question = query;
            AskQuestion();
        }

        private void AskQuestion()
        {
            string sessionId = (Guid.NewGuid()).ToString();
            var values = new Dictionary<string, string>
            {
                { "query", Question },
                { "lang", lang },
                { "sessionId", sessionId }
            };
            var content = Newtonsoft.Json.JsonConvert.SerializeObject(values);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = client.PostAsync(uri, new StringContent(content, Encoding.UTF8, "application/json"))
                .Result.Content.ReadAsStringAsync().Result;
            JObject jObject = JObject.Parse(response);

            Intent = jObject["result"]["action"].ToString().Substring(6);
            //if (Intent.Equals("unknown"))
            //{
            //    SendToProfessor();
            //    return;
            //}

            Answer = jObject["result"]["fulfillment"]["speech"].ToString();
        }
        
        public static void SendToProfessor(string subjectP, string question)
        {
            var fromAddress = new MailAddress("digitalnoobrazovanje@gmail.com");
            var fromPassword = "digobr1234";
            var toAddress = new MailAddress("tomislav.maslac95@gmail.com");

            string subject = "New question  - " + subjectP;
            string body = question;

            SmtpClient smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };

            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body
            })
            smtp.Send(message);
            //Answer = "Question sent to professor.";
        }
    }
}