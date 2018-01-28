using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

namespace DemoWebSite
{
    /// <summary>
    /// Summary description for StudentService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]
    public class StudentService : System.Web.Services.WebService
    {

        [WebMethod]
        public void GetAllStudents()
        {
            List<Student> listStudents = new List<Student>();
            string cs = ConfigurationManager.ConnectionStrings["DBCS"].ConnectionString;
            using (MySqlConnection mycs = new MySqlConnection(cs))
            {
                MySqlCommand cmd = new MySqlCommand("Select * from tblstudents", mycs);
                mycs.Open();
                MySqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Student student = new Student();
                    student.id = Convert.ToInt32(rdr["Id"]);
                    student.name = rdr["Name"].ToString();
                    student.gender = rdr["Gender"].ToString();
                    student.city = rdr["City"].ToString();
                    listStudents.Add(student);
                }
                // Response .Write("Connection Successful");
            }
            JavaScriptSerializer js = new JavaScriptSerializer();
            Context.Response.Write(js.Serialize(listStudents));
        }
    }
}
