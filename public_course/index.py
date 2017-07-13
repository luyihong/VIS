from flask import Flask, render_template, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from flask_bootstrap import Bootstrap
from wtforms import StringField, SubmitField, BooleanField, SelectMultipleField
from wtforms.validators import Required
from markupsafe import Markup

app = Flask(__name__)
app.config['SECRET_KEY'] = 'hard to guess'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@127.0.0.1:3306/public_course'
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
bootstrap = Bootstrap(app)
db = SQLAlchemy(app)


class Course_info(db.Model):
    __tablename__ = "course_info"
    Cno = db.Column(db.String(8), primary_key=True)     #课程号
    Cname = db.Column(db.String(23))                    #课程名称
    no = db.Column(db.String(2), primary_key=True)      #课序号
    Cca = db.Column(db.String(3))                       #课容量
    Chour = db.Column(db.String(5))                     #课程班总学时
    Ccredit = db.Column(db.String(7))                   #课程学分
    CTeacher = db.Column(db.String(9))                  #主讲教师姓名
    Cfaculty = db.Column(db.String(18))                 #主讲教师所在系
    Cstudent = db.Column(db.String(114))                #开课对象
    Ctinfo = db.Column(db.String(1035))                 #教师简介
    Cinfo = db.Column(db.String(879))                   #课程简介
    comment = db.Column(db.String(222))                 #备注
    CTags = db.Column(db.String(255))

    def to_json(self):
        return {
            'Cno': self.Cno,
            'Cname': self.Cname,
            'no': self.no,
            'Cca': self.Cca,
            'Chour': self.Chour,
            'Ccredit': self.Ccredit,
            'CTeacher': self.CTeacher,
            'Cfaculty': self.Cfaculty,
            'Cstudent': self.Cstudent,
            'Ctinfo': self.Ctinfo,
            'Cinfo': self.Cinfo,
            'comment': self.comment,
            'CTags': self.CTags,
        }

    def __repr__(self):
        return '<Course_info {}>'.format(self.Cno)

class Course_tags(db.Model):
    __tablename__ = "course_tags"
    Tno = db.Column(db.String(11), primary_key=True)    #tag序号，自增
    Tname = db.Column(db.String(255))                   #tag名
    Tcount = db.Column(db.String(11))                   #出现次数
    Trelatives = db.Column(db.String(1023))                #一级关联标签
    Tcourses = db.Column(db.String(1023))                     #有这个标签的课程
    Tteachers = db.Column(db.Numeric(255))                #有这个标签的课程的老师
    Tflag = db.Column(db.String(15))                    #标签词性
    def to_json(self):
        return {
            'Tno': self.Tno,
            'Tname': self.Tname,
            'Tcount': self.Tcount,
            'Trelatives': self.Trelatives,
            'Tcourses': self.Tteachers,
            'Tteachers': str(self.Ccredit),
            'Tflag': self.Tflag
        }

    def __repr__(self):
        return '<Course_tags {}>'.format(self.Cno)


class Course_time(db.Model):
    __tablename__ = "course_time"
    Cno = db.Column(db.String(8), primary_key=True)     #课程号
    Cname = db.Column(db.String(23))                    #课程名称
    no = db.Column(db.String(1), primary_key=True)      #课序号
    Cca = db.Column(db.String(3))                       #课容量
    Chour = db.Column(db.String(2))                     #课程班总学时
    Ccredit = db.Column(db.Numeric(2,1))                #课程学分
    Cteacher = db.Column(db.String(3))                  #主讲教师姓名
    Cteacher_2 = db.Column(db.String(6))                #合讲教师
    Cweek = db.Column(db.String(8))                     #周次分布
    Cday = db.Column(db.Integer)                        #星期（一二三四五六七）
    Ctime = db.Column(db.String(6))                  #节次
    Cweek_2 = db.Column(db.String(14))                 #周次分布_2
    Cday_2 = db.Column(db.String(1))                 #星期_2
    Ctime_2 = db.Column(db.String(6))                   #节次_2

    def to_json(self):
        return {
            'Cno': self.Cno,
            'Cname': self.Cname,
            'no': self.no,
            'Cca': self.Cca,
            'Chour': self.Chour,
            'Ccredit': str(self.Ccredit),
            'Cteacher': self.Cteacher,
            'Cteacher_2': self.Cteacher_2,
            'Cweek': self.Cweek,
            'Cday': self.Cday,
            'Ctime': self.Ctime,
            'Cweek_2': self.Cweek_2,
            'Cday_2': self.Cday_2,
            'Ctime_2': self.Ctime_2,
        }

    def __repr__(self):
        return '<Course_time {}>'.format(self.Cno)

@app.route('/viz')
def viz():
    courseType = ['A', 'H', 'E', 'S', 'J', 'P', 'L']
    courseSum = [0] * 7  # 该分类下课程总数
    capacitySum = [0] * 7  # 该分类下课容量求和
    hoursSum = [0] * 7  # 该分类下总课时求和
    rateSum = [0] * 7  # 该分类下每门课程总学分与总课时比值求和，所谓“效率比”
    for i in range(len(courseType)):
        filter = "%" + courseType[i] + "%"
        result = Course_info.query.filter(Course_info.Cno.like(filter)).all()
        for rs in result:
            courseSum[i] += 1
            hoursSum[i] += int(rs.Chour)
            capacitySum[i] += int(rs.Cca)
            rateSum[i] += float(rs.Ccredit) / int(rs.Chour)

    return render_template('viz.html',courseSum=courseSum,\
                           capacitySum=capacitySum,hoursSum=hoursSum,rateSum=rateSum)

@app.route('/')
def index():
    rsT = Course_time.query.all()
    rsI = Course_info.query.all()

    tempT = []
    tempI = []
    for x in rsT:
        tempT.append(x.to_json())
    for x in rsI:
        tempI.append(x.to_json())
    return render_template("PublicCourse3.html",CourseT=Markup(tempT),CourseI=Markup(tempI))

result_info = Course_info.query.filter().all()
#参考http://by.cuc.edu.cn/jxdw学校教学机构单位
#faculty2teacher
f2t = {'动画与数字艺术学院': [], '计算机学院': [], '马克思主义学院': [], '广告学院': [], '电视学院': [], \
           '艺术研究院': [], '文法学部': [], '理学院': [], '音乐与录音艺术学院': [], '新闻传播学部': [], '传播研究院': [], \
           '戏剧影视学院': [], '艺术学部': [], '文化发展研究院': [], '华中科技大学、理工学部': [], '理工学部': [], \
           '协同创新中心': [], '经济与管理学院': [], '体育部': [], '教育体卫艺司、教务处': [], '信息工程学院': [], \
           '工商管理系': [], '外国语学院': [], '图书馆': [], '国际传媒教育学院': [], '播音主持艺术学院': [], \
           '山东大学、广告学院': [], '北京大学、文法学部': [], \
           '新闻学院': [], '北京大学、艺术学部': [], '吉林大学等\n跨校共建、马克思主义学院': []}
for rs in result_info:
    f2t[rs.Cfaculty].append((rs.CTeacher, rs.CTeacher))

class TeacherForm1(FlaskForm):
    # my_choices = [('1', 'Choice1'), ('2', 'Choice2'), ('3', 'Choice3')]
    select0 = SelectMultipleField('新闻传播学部',choices=f2t['电视学院']+f2t['传播研究院']+f2t['新闻学院']+f2t['新闻传播学部'])#default=['1', '3']
    select1 = SelectMultipleField('艺术学部',choices=f2t['动画与数字艺术学院']+f2t['音乐与录音艺术学院']+f2t['艺术学部']+f2t['戏剧影视学院']+f2t['艺术研究院'])
    select2 = SelectMultipleField('理工学部',choices=f2t['理工学部']+f2t['理学院']+f2t['信息工程学院'])
    select3 = SelectMultipleField('文法学部',choices=f2t['文法学部']+f2t['传播研究院']+f2t['新闻学院'])
    select4 = SelectMultipleField('经管学部',choices=f2t['经济与管理学院']+f2t['文化发展研究院']+f2t['工商管理系'])
    select5 = SelectMultipleField('体育部',choices=f2t['体育部'])
    select6 = SelectMultipleField('播音主持艺术学院',choices=f2t['播音主持艺术学院'])

    submit = SubmitField('Submit')

class TeacherForm2(FlaskForm):
    select7 = SelectMultipleField('国际传媒教育学院',choices=f2t['国际传媒教育学院'])
    select8 = SelectMultipleField('外国语学院',choices=f2t['外国语学院'])
    select9 = SelectMultipleField('马克思主义学院',choices=f2t['马克思主义学院'])
    select10 = SelectMultipleField('协同创新中心',choices=f2t['协同创新中心'])
    select11 = SelectMultipleField('广告学院',choices=f2t['广告学院'])
    select12 = SelectMultipleField('学校机构',choices=f2t['教育体卫艺司、教务处']+f2t['图书馆'])
    select13 = SelectMultipleField('其它学校',choices=f2t['山东大学、广告学院']+f2t['北京大学、文法学部']+f2t['北京大学、艺术学部']+f2t['华中科技大学、理工学部']+f2t['吉林大学等\n跨校共建、马克思主义学院']+f2t['新闻学院']+f2t['新闻学院'])

    submit = SubmitField('Submit')

class ClearForm(FlaskForm):
    submit = SubmitField('Clear')

@app.route('/teacher', methods = ['GET', 'POST'])
def teacher():
    form1 = TeacherForm1()
    form2 = TeacherForm2()
    form3 = ClearForm()
    links = []
    info = []
    if form3.validate_on_submit():
        session['teachers'] = []
        return redirect(url_for('teacher'))
    if form1.validate_on_submit() or form2.validate_on_submit():
        session['teachers'] = session['teachers']+ form1.select0.data + form1.select1.data + form1.select2.data \
                          + form1.select3.data + form1.select4.data + form1.select5.data + form1.select6.data \
                          + form1.select1.data+ form2.select7.data + form2.select8.data + form2.select9.data \
                          + form2.select10.data + form2.select11.data + form2.select12.data + form2.select13.data
        return redirect(url_for('teacher'))
    # result_info = Course_info.query.filter().all()
    teachers = session.get('teachers',None)
    if(teachers):
        result_info=Course_info.query.filter(Course_info.CTeacher.in_(teachers)).all()
        result_tag = Course_tags.query.filter().all()
    # 英文序列号变成中文的课程类型
        E2C = {'NS': '科技类网络程', 'P0': '健康与体育类课程', 'H0': '人文社科类课程', 'A0': '艺术类课程', 'NE': '经管类网络课程', 'L0': '外语类课程', \
               'J0': '新闻传播类课程', 'NA': '艺术类网络课程', 'S0': '科技类课程', 'NH': '人文社科类网络课程', 'E0': '经管类课程'}
        if(result_info):
            for rs in result_info :
                # teacher->faculty
                links.append({'source':rs.CTeacher,'target':rs.Cfaculty,'type':'faculty','rela':'属于'})
                # teacher->coursetype
                links.append({'source':rs.CTeacher,'target':E2C[rs.Cno[2:4]],'type':'course','rela':'授课'})
                # info:teacher
                info.append({rs.CTeacher:'<p>教授课程<br>'+rs.Cname+ '</br><br>课程标签</br><br>'+rs.CTags+'</br></p><p>教师简介<br>'+rs.Ctinfo+'</br></p>'})

        if(result_tag):
            for rs in result_tag:
                if (rs.Tteachers != None):
                    teacherlist = rs.Tteachers.split()
                for teacher in teacherlist:
                    if teacher in teachers:
                        # teacher->tag
                        links.append({'source': teacher, 'target': rs.Tname, 'type': "tag", 'rela': "标签"})

    return render_template("teacher.html",links=Markup(links),info=Markup(info),form1=form1,form2=form2,form3=form3)

class SearchForm(FlaskForm):
    search = StringField('想上什么课？', validators = [Required()])
    submit = SubmitField('Submit')
    select = BooleanField('Available')

@app.route('/search', methods = ['GET', 'POST'])
def search():
    form = SearchForm()
    # session['known'] = False
    # session['result'] = None
    if form.validate_on_submit():
        courselist = Course_info.query.filter(Course_info.Cname.like("%"+form.search.data+"%")).all()
        if courselist == []:
            session['known'] = False
            session['result'] = None
        else:
            session['known'] = True
            session['result'] = []
            for course in courselist:
                session['result'] .append(course.Cname)
        return redirect(url_for('search'))

    return render_template("search.html", form=form, result=session.get('result'),
                           known=session.get('known', False))

if __name__ == '__main__':
    app.run(debug=True)
    # app.run(host='10.194.72.68')
