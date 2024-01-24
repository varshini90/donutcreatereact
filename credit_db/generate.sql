create table country
(
    id        int auto_increment
        primary key,
    iso       char(2)     not null,
    name      varchar(80) not null,
    nicename  varchar(80) not null,
    iso3      char(3)     null,
    numcode   smallint    null,
    phonecode int         not null
);

create table user_info
(
    dob           date         not null,
    email         varchar(50)  not null
        primary key,
    first_name    varchar(200) not null,
    last_name     varchar(200) not null,
    pass          varchar(200) not null,
    lastupdatedts datetime     not null,
    created_date  datetime     not null
);

create table credit_analysis_info
(
    ID            int auto_increment
        primary key,
    user_id       varchar(200) null,
    annual_income int          not null,
    occupation    varchar(200) not null,
    country_cd    int          null,
    loan          int          not null,
    created_date  datetime     null,
    constraint credit_analysis_info_country_null_fk
        foreign key (country_cd) references country (id),
    constraint credit_analysis_info_user_info_null_fk
        foreign key (user_id) references user_info (email)
);

